import { AbstractIndexCreationTask } from 'ravendb';

class Notifications extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from notification in docs.Notifications
select new
{
  notification.notificationSource,
  notification.type,
  notification.oneTime,
  notification.milestoneMeterValueMultiplier,
  clientId = notification.client.id,
  equipmentId = notification.equipment.id,
  serviceIntervalId = notification.serviceInterval.id,
  alertedUserId = Enumerable.Select(notification.alertedUsers, o => o.id),
  notification.updatedOn,
  notificationSeen = notification.viewedOn == null ? false : true,
  notification.viewedOn
}`;
  }
}

export { Notifications };
