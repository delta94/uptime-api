import { AbstractIndexCreationTask } from 'ravendb';

class Users extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from user in docs.Users
select new
{
  Query = new
  {
      user.firstName,
      user.lastName,
      roles = Enumerable.Select(user.roles, role => role.name),
      user.email,
      user.idNumber,
      clientName = user.client.name
  },
  user.firstName,
  user.lastName,
  user.email,
  user.idNumber,
  user.active,
  user.createdOn,
  user.updatedOn,
  roles = Enumerable.Select(user.roles, role => role.name),
  mobileDeviceIds = Enumerable.Select(user.mobileDevices, device => device.deviceId),
  phoneNumbers = Enumerable.Select(user.phones, phone => phone.digits),
  clientId = user.client.id
}`;
  }
}

export { Users };
