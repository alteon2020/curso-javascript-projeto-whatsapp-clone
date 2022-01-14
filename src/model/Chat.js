import { Model } from "./Model";
import { Firebase } from '../util/Firebase';

export class Chat extends Model {
    constructor() {
      super();
    }

  get users() { return this._data.users; }
  set users(value) { this._data.users = value; }

  get timeStamp() { return this._data.timeStamp; }
  set timeStamp(value) { this._data.timeStamp = value; }

  static getRef() {
    return Firebase.db().collection('/chats');
  }

  static create(myEmail, contactEmail) {

    return new Promise((s, f) => {
      let users = {};

      users[btoa(myEmail)] = true;
      users[btoa(contactEmail)] = true;

      Chat.getRef().add({
        users,
        timeStamp: new Date()
      }).then(doc => {
        Chat.getRef().doc(doc.id).get().then(chat => {
          s(chat);
        }).catch(err => { f(err); });
      }).catch(err => { f(err); });

    });
  }

  static find(myEmail, contactEmail) {
      return Chat.getRef()
        .where(btoa(myEmail), '==', true)
        .where(btoa(contactEmail), '==', true)
        .get();

  }

  static createIfNotExists(myEmail, contactEmail) {
      return new Promise((s, f) => {
        Chat.find(myEmail, contactEmail).then(chats => {
          if (chats.empty) {
            //Create
              Chat.create(myEmail, contactEmail).then(chat => {
                  s(chat);
              });
          } else {
              chats.forEach(chat => {
                  s(chat);
              });
          }
        }).catch(err => { f(err); });
      });
  }

} 
