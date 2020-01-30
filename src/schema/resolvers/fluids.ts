import { Context } from '@/helpers/interfaces';
import { Resolver, Query, Arg, Ctx, Mutation, Args } from 'type-graphql';
import { getAppSettings, verifyAccess, Roles, formatSearchTerm, getNowUtc } from '@/helpers/utils';
import { Fluids } from '@/types/appSettings/Fluids';
import { FluidTableList } from '@/types/fluids/FluidTableList';
import { Fluid } from '@/types/appSettings/Fluid';
import { FluidReportTableList } from '@/types/fluids/FluidReportTableList';
import { QueryStatistics, GroupByField } from 'ravendb';
import { FluidReportInput } from '@/types/fluids/FluidReportInput';
import { FluidReport } from '@/types/fluids/FluidReport';
import { FluidInput } from '@/types/appSettings/FluidInput';
import { User } from '@/types/user/User';
import { UserReference } from '@/types/user/UserReference';
import { RoleTypeEnum, NotificationSourceEnum } from '@/types/Enums';
import { TablePaginationWithSearchFilterArgs } from '@/types/TablePaginationWithSearchFilterArgs';
import { ResponseChartDay } from '@/types/fluids/charts/ResponseChartDay';
import { FluidChartArgs } from '@/types/fluids/charts/FluidChartArgs';
import { DateTime } from 'luxon';
import { DayItem } from '@/types/fluids/charts/DayItem';
import moment = require('moment');
import { ResponseChartTotal } from '@/types/fluids/charts/ResponseChartTotal';
import { checkServiceInterval } from '@/helpers/notificationsHelper';
import { Equipment } from '@/types/equipment/Equipment';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { FluidsTablePaginationArgs } from '@/types/fluids/FluidsTablePaginationArgs';
const tempfile = require('tempfile');
const Excel = require('exceljs/modern.nodejs');
const fs = require('fs');

@Resolver()
export class FluidResolver {
  //#region Queries

  @Query(() => FluidTableList)
  async fluids(@Ctx() { session }: Context): Promise<FluidTableList> {
    const fluids = await getAppSettings<Fluids>(session, 'Fluids');
    return { fluids: fluids.data, totalRows: fluids.data.length };
  }

  @Query(() => ResponseChartTotal)
  async chartTotal(@Ctx() { session, req }: Context): Promise<ResponseChartTotal> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);
    const chartData = session.query<FluidReport>({ indexName: 'FluidReports/Totals' });

    if (req.user.clientId) {
      chartData.whereEquals('clientId', req.user.clientId.toLowerCase());
    }

    return {
      chartData: await chartData.all(),
    };
  }

  @Query(() => ResponseChartDay)
  async chartDay(@Args() { dateFrom, dateTo, selectedFluids }: FluidChartArgs, @Ctx() { session, req }: Context): Promise<ResponseChartDay> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);
    const fluidsQuery = session.query<FluidReport>({ indexName: 'FluidReports/Day' });

    if (dateFrom && dateTo) {
      fluidsQuery.whereBetween('createdOn', dateFrom, dateTo);
    } else {
      const daysToTake = 60;

      fluidsQuery.whereBetween(
        'createdOn',
        DateTime.utc()
          .plus({ days: daysToTake * -1 })
          .toJSDate(),
        DateTime.utc().toJSDate()
      );
    }

    if (req.user.clientId) {
      fluidsQuery.andAlso().whereEquals('clientId', req.user.clientId);
    }

    if (selectedFluids && selectedFluids.length > 0)
      fluidsQuery
        .andAlso()
        .whereIn('fluid', selectedFluids)
        .orderBy('createdOn');

    const fluidsDB = await fluidsQuery.all();
    const chartByDayData: DayItem[] = [];
    const fluidNames: string[] = [];
    fluidsDB.forEach(item => {
      const found = chartByDayData.find((dayItem: DayItem) => dayItem.date === item.createdOn);
      if (!found) {
        const dayItem: DayItem = {
          name: moment(item.createdOn).format('MMM D'),
          date: item.createdOn,
          unitOfMeasure: item.unitOfMeasure,
          [item.fluid]: item.amount,
        };
        chartByDayData.push(dayItem);
      } else {
        found[item.fluid] = item.amount;
      }
      if (!fluidNames.includes(item.fluid)) fluidNames.push(item.fluid);
    });

    return {
      fluidNames: fluidNames,
      chartByDayDataJSON: JSON.stringify(chartByDayData),
    };
  }

  @Query(() => FluidReportTableList)
  async fluidReports(
    @Args() { skip, pageSize, searchText, from, to }: FluidsTablePaginationArgs,
    @Ctx() { session, req }: Context
  ): Promise<FluidReportTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const fluidReportQuery = session
      .query<FluidReport>({ indexName: 'FluidReports' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('createdOn')
      .skip(skip)
      .take(pageSize);

    if (from && to) {
      fluidReportQuery.whereBetween('createdOn', from, to);
    }   

    if (searchText) {
      fluidReportQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        fluidReportQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      fluidReportQuery.whereEquals('clientId', req.user.clientId);
    }

    return { fluidReports: await fluidReportQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => FluidReportTableList)
  async fluidReportsExcel(@Ctx() { session, req, res }: Context): Promise<FluidReportTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const fluidReportQuery = session
      .query<FluidReport>({ indexName: 'FluidReports' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('createdOn')
      .take(1000);

    if (req.user.clientId) {
      fluidReportQuery.andAlso().whereEquals('clientId', req.user.clientId);
    }

    // const data = await fluidReportQuery.all();
    // const workbook = new Excel.Workbook();
    // workbook.creator = 'Uptime.com';

    // workbook.created = new Date();
    // workbook.modified = new Date();
    // workbook.lastPrinted = new Date();
    // const sheet = workbook.addWorksheet('Fluids');

    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('My Sheet');

      worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 32 },
        { header: 'D.O.B.', key: 'DOB', width: 10 },
      ];
      worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
      worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

      const tempFilePath = tempfile('.xlsx');
      workbook.xlsx.writeFile(tempFilePath).then(() => {
        // console.log('file is written');
        res.sendFile(tempFilePath, (err: any) => {
          console.log('---------- error downloading file: ' + err);
        });
      });

      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.log('OOOOOOO this is the error: ' + err);
    }
    return { fluidReports: await fluidReportQuery.all(), totalRows: stats.totalResults };
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [Fluid])
  async saveFluids(@Arg('data', () => [FluidInput]) data: FluidInput[], @Ctx() { session, req }: Context): Promise<Fluid[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const fluids = await getAppSettings<Fluids>(session, 'Fluids');
    fluids.data = data;
    await session.saveChanges();
    return fluids.data;
  }

  @Mutation(() => FluidReport)
  async saveFluidReport(@Arg('data', () => FluidReportInput) data: FluidReportInput, @Ctx() { session, req }: Context): Promise<FluidReport> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const entity = await FluidReport.fromFluidReportInput(session, data);
    const user = await session.load<User>(req.user.id);
    entity.user = UserReference.fromUser(user);
    entity.client = user.client;
    entity.completedOn = getNowUtc();

    if (entity.equipment) {
      const equipment = await session.load<Equipment>(entity.equipment.id);
      const newMeterValue = entity.meterValue;

      if (equipment.serviceInterval) {
        console.log('Starting notification');
        await checkServiceInterval(
          equipment,
          entity.client,
          equipment.serviceInterval.id,
          newMeterValue,
          NotificationSourceEnum.FluidReport,
          session,
          entity.user
        );
      }
    }
    await session.store<FluidReport>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
