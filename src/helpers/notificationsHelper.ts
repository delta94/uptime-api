import { IDocumentSession, DocumentSession } from 'ravendb';
import { ServiceInterval } from '@/types/serviceInterval/ServiceInterval';
import { Notification } from '@/types/notifications/Notification';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { Equipment } from '@/types/equipment/Equipment';
import { OfficeLocationReference } from '@/types/officeLocation/OfficeLocationReference';
import { IdNameReference } from '@/types/common/IdNameReference';
import { ServiceIntervalMilestoneReference } from '@/types/serviceInterval/ServiceIntervalMilestoneReference';
import { ServiceIntervalNotificationReference } from '@/types/serviceInterval/ServiceIntervalNotificationReference';
import { NotificationSourceEnum, WorkOrderStatusEnum, NotificationTypeEnum, EquipmentTypeEnum } from '@/types/Enums';
import { maxBy, orderBy, uniq, uniqBy } from 'lodash';
import { OfficeLocation } from '@/types/officeLocation/OfficeLocation';
import { Job } from '@/types/job/Job';
import { ServiceIntervalMilestone } from '@/types/serviceInterval/ServiceIntervalMilestone';
import { UserReference } from '@/types/user/UserReference';
import { ServiceIntervalServiceItem } from '@/types/serviceInterval/ServiceIntervalServiceItem';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { WorkOrderWorkItem } from '@/types/workOrder/WorkOrderWorkItem';
import { WorkOrderHistoryItem } from '@/types/workOrder/WorkOrderHistoryItem';
import { getNowUtc } from './utils';
import { JobReference } from '@/types/job/JobReference';
import { BasicOfficeLocationReference } from '@/types/officeLocation/BasicOfficeLocationReference';
import { EquipmentPart } from '@/types/equipment/EquipmentPart';
import { ContactForm } from '@/types/contactForm/ContactForm';
import { ContactFormInput } from '@/types/contactForm/ContactFormInput';

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'secure.emailsrvr.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'support@uptimepm.com',
    pass: 'umeeZqj9WJcU7@mzcKVi',
  },
});

const getServiceIntervalNotificationText = (
  equipment: Equipment,
  serviceItems: ServiceIntervalServiceItem[],
  alertBeforeDue: number,
  notificationId: string
) => {
  let serviceItemsStr = '';

  serviceItems.forEach((serviceItem: ServiceIntervalServiceItem) => {
    serviceItemsStr += '<b>Service Item:</b> ' + serviceItem.name;
    if (serviceItem.partName) serviceItemsStr += ' ' + serviceItem.partName;
    if (serviceItem.partNumber) serviceItemsStr += ' ' + serviceItem.partNumber;
    serviceItemsStr += '<br />';
  });

  const onlyId = notificationId.split('/')[1]; // need this because id is WorkOrder but needed work-order
  const notificationUrl = `${process.env.FRONT_END_HOSTNAME}/client/work-orders/${onlyId}`;

  return (
    '<h3>' +
    'Due soon: ' +
    serviceItems.length +
    ' service items' +
    '</h3>' +
    '<br />' +
    '<b>Vehicle: </b>' +
    equipment.name +
    '<br />' +
    serviceItemsStr +
    '<br />' +
    '<b>Due in: </b>' +
    alertBeforeDue +
    ' ' +
    equipment.meterType +
    '<br />' +
    '<b>Meter value: </b>' +
    equipment.meterValue +
    ' ' +
    equipment.meterType +
    '<br />' +
    '<br />' +
    'View notification:' +
    '<br />' +
    notificationUrl +
    '<br />' +
    '<br />' +
    '<br />' +
    'Thank you for using the site!' +
    '<br />' +
    'Uptime Team' +
    '<br />' +
    'https://www.uptimepm.com'
  );
};

const getWorkOrderNotificationText = (equipment: Equipment, notes: string, workOrderId: string) => {
  const onlyId = workOrderId.split('/')[1]; // need this because id is WorkOrder but needed work-order
  const workOrderUrl = `${process.env.FRONT_END_HOSTNAME}/client/work-orders/${onlyId}`;
  return (
    '<h3>' +
    'Work Order ' +
    '</h3>' +
    '<br />' +
    '<b>Notes: </b>' +
    notes +
    '<br />' +
    '<b>Vehicle: </b>' +
    equipment.name +
    '<br />' +
    '<b>Meter value: </b>' +
    equipment.meterValue +
    ' ' +
    equipment.meterType +
    '<br />' +
    '<br />' +
    'View notification:' +
    '<br />' +
    workOrderUrl +
    '<br />' +
    '<br />' +
    '<br />' +
    'Thank you for using the site!' +
    '<br />' +
    'Uptime Team' +
    '<br />' +
    'https://www.uptimepm.com'
  );
};

const getContactFormNotificationText = (contactForm: ContactForm) => {
  const onlyId = contactForm.id.split('/')[1]; // need this because id is WorkOrder but needed work-order
  const contactFormUrl = `${process.env.FRONT_END_HOSTNAME}/admin/contact-forms/${onlyId}`;
  return (
    '<h3>' +
    'Contact Form Submission ' +
    '</h3>' +
    '<br />' +
    '<b>Name: </b>' +
    contactForm.name +
    '<br />' +
    '<b>Email: </b><a href="mailto:' +
    contactForm.email +
    '">' +
    contactForm.email +
    '</a>' +
    '<br />' +
    '<b>Message: </b>' +
    contactForm.message +
    '<br />' +
    'Uptime Team' +
    '<br />' +
    'https://www.uptimepm.com'
  );
};

const getNotificationEntity = (
  equipment: Equipment,
  client: IdNameReference,
  serviceInterval: ServiceInterval,
  newMeterValue: number,
  notificationSource: NotificationSourceEnum,
  type: NotificationTypeEnum,
  milestone: ServiceIntervalMilestone,
  oneTime: boolean,
  alertedUsers: UserReference[],
  officeLocationRef: OfficeLocationReference,
  multiplier?: number
) => {
  const equipmentRef = DetailedEquipmentReference.fromEquipment(equipment);
  const milestoneRef = new ServiceIntervalMilestoneReference(serviceInterval.id! + milestone.id.toString(), milestone.title, milestone.oneTime, true, true);
  const serviceIntervalRef = new ServiceIntervalNotificationReference(
    serviceInterval.id,
    serviceInterval.title,
    milestoneRef,
    newMeterValue,
    equipment.meterType
  );

  const notificationEntity = new Notification(
    notificationSource,
    type,
    client,
    equipmentRef,
    alertedUsers,
    officeLocationRef,
    equipment.job,
    oneTime,
    milestone.meterValue,
    serviceIntervalRef,
    multiplier
  );

  return notificationEntity;
};

const getWorkOrderEntity = (
  equipmentRef: DetailedEquipmentReference,
  milestoneRef: ServiceIntervalMilestoneReference,
  client: IdNameReference,
  who: UserReference,
  mechanics: UserReference[],
  basicOfficeLocationRef: BasicOfficeLocationReference,
  job: JobReference,
  newMeterValue: number,
  milestone: ServiceIntervalMilestone,
  serviceInterval: ServiceInterval,
  meterType: string
) => {
  // Creating work orders for each Service Interval
  // Batching all service items in workOrder.workItems

  const workOrder = new WorkOrder(equipmentRef, client, who, mechanics, '', WorkOrderStatusEnum.Open, basicOfficeLocationRef, job, newMeterValue);
  workOrder.workItems = [];
  for (const serviceItem of milestone.serviceItems) {
    console.log('Service Interval: create work orders serviceItem', serviceItem.name);
    // const msg = `Created from ${milestone.title}: ${serviceItem.name}`;
    const workItem = new WorkOrderWorkItem(serviceItem.name);

    workOrder.parts = [{ name: serviceItem.partName, sku: serviceItem.partNumber, make: equipmentRef.make, model: equipmentRef.model } as EquipmentPart];
    // workItem.partName = serviceItem.partName;
    // workItem.partNumber = serviceItem.partNumber;
    workOrder.workItems.push(workItem);
  }
  workOrder.createdOn = getNowUtc();
  workOrder.updatedOn = getNowUtc();
  workOrder.completedOn = getNowUtc();

  workOrder.history = [new WorkOrderHistoryItem(`Created from Service Interval ${milestone.title}`, who)];

  workOrder.serviceInterval = new ServiceIntervalNotificationReference(serviceInterval.id, serviceInterval.title, milestoneRef, newMeterValue, meterType);
  return workOrder;
};

const getAlertedUsers = async (session: IDocumentSession, equipment: Equipment, officeLocationRef: OfficeLocationReference): Promise<UserReference[]> => {
  let alertedUsers: UserReference[] = [];
  if (officeLocationRef.notificationUsers) alertedUsers = officeLocationRef.notificationUsers;
  if (equipment.job) {
    const job = await session.load<Job>(equipment.job.id);
    alertedUsers = alertedUsers.concat(job.notificationUsers);
  }
  alertedUsers = uniqBy(alertedUsers, 'id');
  // console.log('alertedUsers');
  // console.log(alertedUsers);
  return alertedUsers;
};

export const checkServiceInterval = async (
  equipment: Equipment,
  client: IdNameReference,
  serviceIntervalId: string,
  newMeterValue: number,
  notificationSource: NotificationSourceEnum,
  session: IDocumentSession,
  who: UserReference
) => {
  const serviceInterval = await session.load<ServiceInterval>(serviceIntervalId);

  if (serviceInterval) {
    const notificationsSent = await session
      .query<Notification>({ indexName: 'Notifications' })
      .orderByDescending('updatedOn')
      .whereEquals('serviceIntervalId', serviceInterval.id)
      .whereEquals('equipmentId', equipment.id)
      .whereEquals('clientId', client.id)
      .whereEquals('type', NotificationTypeEnum.ServiceInterval)
      .all();

    //#region oneTime notifications
    for (const milestone of serviceInterval.milestones.filter(x => x.oneTime)) {
      const milestoneMeterWithAlertBeforeDue = milestone.meterValue - milestone.alertBeforeDue;
      const isSent =
        notificationsSent.filter(x => x.oneTime).findIndex(x => x.milestoneMeterValue === milestone.meterValue) === -1 // check if already sent (ex: meterValue: 250 )
          ? false
          : true;

      if (milestoneMeterWithAlertBeforeDue < newMeterValue && !isSent) {
        console.log('region create work order from: Service Interval One Time');
        const officeLocation = await session.load<OfficeLocation>(equipment.officeLocation.id);
        const officeLocationRef = OfficeLocationReference.fromOfficeLocation(officeLocation);
        const alertedUsers = await getAlertedUsers(session, equipment, officeLocationRef);

        const notificationEntity = getNotificationEntity(
          equipment,
          client,
          serviceInterval,
          newMeterValue,
          notificationSource,
          NotificationTypeEnum.ServiceInterval,
          milestone,
          true,
          alertedUsers,
          officeLocationRef
        );
        await session.store<Notification>(notificationEntity);
        // await session.saveChanges();

        //#region Service Interval One Time: create work orders
        const equipmentRef = DetailedEquipmentReference.fromEquipment(equipment);
        const milestoneRef = new ServiceIntervalMilestoneReference(
          serviceInterval.id! + milestone.id.toString(),
          milestone.title,
          milestone.oneTime,
          true,
          true
        );

        const basicOfficeLocationReference = BasicOfficeLocationReference.fromOfficeLocation(officeLocation);

        const workOrderEntity = getWorkOrderEntity(
          equipmentRef,
          milestoneRef,
          client,
          who,
          equipment.mechanics,
          basicOfficeLocationReference,
          equipment.job,
          newMeterValue,
          milestone,
          serviceInterval,
          equipment.meterType
        );
        await session.store(workOrderEntity);
        await session.saveChanges();
        //#endregion

        // sending email
        alertedUsers.forEach(async (user: UserReference) => {
          const notificationEmailBody = getServiceIntervalNotificationText(equipment, milestone.serviceItems, milestone.alertBeforeDue, workOrderEntity.id);

          // const notificationEmailBody = getWorkOrderNotificationText(
          //   equipment,

          //   milestone.serviceItems,
          //   milestone.alertBeforeDue,
          //   notificationEntity.id
          // );
          // console.log(user.email);

          // Comment in to send emails
          const email = process.env.NODE_ENV === 'development' ? 'troy@uptimepm.com' : user.email;
          // const email = user.email;
          console.log(email);
          const info = await transporter.sendMail({
            from: '"UptimePM" <support@uptimepm.com>',
            to: email,
            bcc: ['troy@uptimepm.com'],
            subject: notificationSource.toString() + ' Service Due (One Time)',
            html: notificationEmailBody, // html body
          });
          if (info.messageId) {
            console.log('Message sent!');
          }
        });

        break; // should exit!
      }
    }
    //#endregion

    //#region recurring notifications
    const biggestNotification = maxBy(notificationsSent, o => {
      return o.milestoneMeterValue;
    });
    let sortedMilestones = orderBy(
      serviceInterval.milestones.filter(x => !x.oneTime),
      ['meterValue'],
      ['desc']
    );
    if (biggestNotification) {
      sortedMilestones = sortedMilestones.filter(x => x.meterValue >= biggestNotification.milestoneMeterValue);
    }
    for (const milestone of sortedMilestones) {
      const milestoneMeterWithAlertBeforeDue = milestone.meterValue - milestone.alertBeforeDue;
      const multiplier = Math.floor(newMeterValue / milestone.meterValue); // example 2
      const isSent =
        notificationsSent
          .filter(x => !x.oneTime)
          .findIndex(x => x.milestoneMeterValue === milestone.meterValue && x.milestoneMeterValueMultiplier === multiplier) === -1 // check if already sent (ex: meterValue: 1000 multiplier:2 ) would be for 2000
          ? false
          : true;

      if (milestoneMeterWithAlertBeforeDue < newMeterValue && !isSent) {
        // console.log('Recurring');
        const officeLocation = await session.load<OfficeLocation>(equipment.officeLocation.id);
        const officeLocationRef = OfficeLocationReference.fromOfficeLocation(officeLocation);
        const alertedUsers = await getAlertedUsers(session, equipment, officeLocationRef);

        const notificationEntity = getNotificationEntity(
          equipment,
          client,
          serviceInterval,
          newMeterValue,
          notificationSource,
          NotificationTypeEnum.ServiceInterval,
          milestone,
          false,
          alertedUsers,
          officeLocationRef,
          multiplier
        );

        await session.store<Notification>(notificationEntity);
        await session.saveChanges();

        //#region Service Interval: create work orders
        console.log('Service Interval Recurring: create work orders');

        const equipmentRef = DetailedEquipmentReference.fromEquipment(equipment);
        const milestoneRef = new ServiceIntervalMilestoneReference(
          serviceInterval.id! + milestone.id.toString(),
          milestone.title,
          milestone.oneTime,
          true,
          true
        );
        const basicOfficeLocationReference = BasicOfficeLocationReference.fromOfficeLocation(officeLocation);

        const workOrderEntity = getWorkOrderEntity(
          equipmentRef,
          milestoneRef,
          client,
          who,
          equipment.mechanics,
          basicOfficeLocationReference,
          equipment.job,
          newMeterValue,
          milestone,
          serviceInterval,
          equipment.meterType
        );
        await session.store(workOrderEntity);
        await session.saveChanges();
        //#endregion

        // sending email
        alertedUsers.forEach(async (user: UserReference) => {
          const notificationEmailBody = getServiceIntervalNotificationText(equipment, milestone.serviceItems, milestone.alertBeforeDue, workOrderEntity.id);
          const email = process.env.NODE_ENV === 'development' ? 'troy@uptimepm.com' : user.email;
          console.log(email);

          // Comment in to send emails
          const info = await transporter.sendMail({
            from: '"UptimePM" <support@uptimepm.com>',
            to: email,
            bcc: ['troy@uptimepm.com'],
            subject: notificationSource.toString() + ' Service Due',
            html: notificationEmailBody, // html body
          });
          if (info.messageId) {
            console.log('Message sent!');
          }
        });
        // console.log('should exit!');
        break; // should exit!
      }
    }
  }

  //#endregion
};

export const saveNotificationWorkOrder = async (
  equipment: Equipment,
  workOrder: WorkOrder,
  client: IdNameReference,
  notificationSource: NotificationSourceEnum,
  session: IDocumentSession,
  hostName: string
) => {
  const equipmentRef = DetailedEquipmentReference.fromEquipment(equipment);
  const officeLocation = await session.load<OfficeLocation>(equipment.officeLocation.id);
  const officeLocationRef = OfficeLocationReference.fromOfficeLocation(officeLocation);
  const alertedUsers = await getAlertedUsers(session, equipment, officeLocationRef);

  const notificationEntity = new Notification(
    notificationSource,
    NotificationTypeEnum.WorkOrder,
    client,
    equipmentRef,
    alertedUsers,
    officeLocationRef,
    equipment.job
  );

  await session.store<Notification>(notificationEntity);
  await session.saveChanges();

  // sending email
  alertedUsers.forEach(async (user: UserReference) => {
    const notificationEmailBody = getWorkOrderNotificationText(equipment, workOrder.notes, workOrder.id);
    console.log(user.email);

    // Comment in to send emails
    const email = process.env.NODE_ENV === 'development' ? 'troy@uptimepm.com' : user.email;
    // console.log(email);
    const info = await transporter.sendMail({
      from: '"UptimePM" <support@uptimepm.com>',
      to: email,
      bcc: ['troy@uptimepm.com'],
      subject: notificationSource.toString() + ' Notification ( ' + workOrder.status + ' )',
      html: notificationEmailBody, // html body
    });
    if (info.messageId) {
      console.log('Message sent!');
    }
  });
};

export const sendContactFormNotification = async (contactForm: ContactForm) => {
  const info = await transporter.sendMail({
    from: '"UptimePM" <support@uptimepm.com>',
    to: ['justin@uptimepm.com', 'troy@uptimepm.com'],
    // to: ['troy@uptimepm.com'],
    subject: 'Contact Us Form Submission',
    html: getContactFormNotificationText(contactForm),
  });
  return info.messageId;
};
