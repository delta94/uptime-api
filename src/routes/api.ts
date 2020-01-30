import { Request, Response } from 'express';
import { verifyAccess, Roles, verifyAccessUser } from '@/helpers/utils';
import { RoleTypeEnum } from '@/types/Enums';
import { CustomRequest } from '@/helpers/interfaces';
import { FluidReport } from '@/types/fluids/FluidReport';
import moment from 'moment';
import { User } from '@/types/user/User';
import { JwtUser } from '@/types/JwtUser';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { IdNameReference } from '@/types/common/IdNameReference';
import { UserReference } from '@/types/user/UserReference';
const express = require('express');
const router = express.Router();
const tempfile = require('tempfile');
const Excel = require('exceljs/modern.nodejs');

// GET /api
router.get('/', (req: Request, res: Response) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

router.get('/fluidReportExcel/:userId', async (req: CustomRequest, res: Response) => {
  const session = req.db.openSession();
  const user = await session.load<User>('Users/' + req.params.userId);
  try {
    await session.store(
      new LogEntry(
        'API > fluidReportExcel > Entry',
        {
          params: req.params,
          reqUser: req.user,
        },
        '[ENTRY]',
        new Error('NO ERROR - LOGGING ONLY').stack,
        user.client,
        UserReference.fromUser(user)
      )
    );
    await session.saveChanges();

    // console.log(user);
    verifyAccessUser(user as JwtUser, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);
    const fluidReportQuery = session
      .query<FluidReport>({ indexName: 'FluidReports' })
      .orderByDescending('createdOn')
      .take(10000);

    if (user.client) {
      fluidReportQuery.whereEquals('clientId', user.client.id);
    }

    const data = await fluidReportQuery.all();
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('My Sheet');

      worksheet.columns = [
        { header: 'Equipment', key: 'equipment', width: 32 },
        { header: 'Fluid', key: 'fluid', width: 25 },
        { header: 'Quantity', key: 'amount', width: 10 },
        { header: 'Unit of Measure', key: 'unitOfMeasure', width: 25 },
        { header: 'Reported By', key: 'reportedBy', width: 30 },
        { header: 'Created On', key: 'createdOn', width: 25 },
      ];

      data.forEach((item: FluidReport, index: number) => {
        const row = {
          equipment: item.equipment.name,
          fluid: item.fluid,
          amount: item.amount,
          unitOfMeasure: item.unitOfMeasure,
          reportedBy: item.user.firstName + ' ' + item.user.lastName,
          createdOn: moment(item.createdOn).format('MM/DD/YYYY HH:MM:SS'),
        };
        worksheet.addRow(row);
      });

      const tempFilePath = tempfile('.xlsx');
      const fileName = 'FluidReports_' + moment().format('MM-DD-YYYY') + '.xlsx';
      workbook.xlsx.writeFile(tempFilePath).then(() => {
        res.download(tempFilePath, fileName);
      });
    } catch (ex) {
      console.log('Error: ' + ex);
      await session.store(
        new LogEntry(
          'API > fluidReportExcel',
          {
            params: req.params,
          },
          ex.message,
          new Error(ex.message).stack,
          user.client,
          UserReference.fromUser(user)
        )
      );
      await session.saveChanges();
      throw ex.message;
    }
  } catch (ex) {
    await session.store(
      new LogEntry(
        'API > fluidReportExcel > Outer Exception',
        {
          params: req.params,
        },
        ex.message,
        new Error(ex.message).stack,
        user.client,
        UserReference.fromUser(user)
      )
    );
    await session.saveChanges();
    throw ex;
  }
});

export default router;
