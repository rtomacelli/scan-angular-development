import { Person, UserAttributes, UserProfile } from '@models/admin';
import { AVATAR_URL, ORGCHART_URL } from '@routes/remote.routes';

export class User {

  constructor(
    public ssoToken: string,
    public uid: string,
    public name: string,
    public department: string,
    public commission: string,
    public phones: string[],
    public roles?: string[],
    public sessionToken?: string,
    public profiles?: UserProfile[],
    public activeProfile?: string,
    public lastLogin?: string
  ) { }

  get normalName(): string {
    return this.name.split(' ')
      .map(n => n.toLowerCase().replace(/^./, c => c.toUpperCase())).join(' ');
  }

  get shortName(): string {
    const names = this.normalName.split(' ');
    return names.slice(0, 2).filter(n => !!n).join(' ');
  }

  get profileUrl(): string {
    return `${ORGCHART_URL}/${this.uid}`;
  }

  get photoUrl(): string {
    return `${AVATAR_URL}/${this.uid}`;
  }

  /**
   * Formats a phone number.
   *
   * @private
   * @param {string} phoneNumber The unformatted phone number from the SSO source.
   * @returns {string} The formatted phone number.
   *
   * @memberOf AuthenticationService
   */
  private static formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/0([0-9]{2}) ([0-9]{4,5})([0-9]{4})/, '($1) $2-$3');
  }

  static fromAttributes(attributes?: UserAttributes): User {
    if (attributes && attributes.sn) {
      const phones = [attributes.homephone, attributes.mobile, attributes.telephonenumber]
        .filter(phone => phone).map(phone => this.formatPhoneNumber(phone));

      return new User(
        attributes.token,
        attributes.uid.toLocaleUpperCase(),
        attributes.sn,
        `${attributes['cd-pref-depe']} ${attributes.nomeUorReduzido}`,
        attributes['tx-cmss-usu'],
        phones,
        attributes.roles || []
      );
    } else {
      // throw new Error('Invalid user attributes received');
      return null;
    }
  }

  toPerson(): Person {
    return {
      matricula: this.uid,
      nomePessoa: this.name,
      lotacao: this.department,
      tipoFunc: this.commission,
      diretoria: '',
      perfilAtivo: '',
      dataUltimoLoginSucedido: '',
      token: '',
      perfis: this.profiles
    };
  }

  updateWithPerson(person: Person): this {
    this.sessionToken = person.token;
    this.profiles = person.perfis;
    this.activeProfile = person.perfilAtivo;
    this.lastLogin = person.dataUltimoLoginSucedido;
    return this;
  }

}
