
//  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
//
//   Copyright 2016-2018 Pascal ECHEMANN.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import {RealmType} from "jec-exchange";

/**
 * A utility class that provides functionalities for working with realm types.
 */
export class RealmTypeUtil {

  /**
   * Resolves the specified string to a valid <code>RealmType</code> value.
   * 
   * @param {string} realmType a string that represents the type of a realm.
   * @return {RealmType} the <code>RealmType</code> that corresponds to the
   *                     specified realm type value.
   */
  public static resolveRealmType(realmType:string):RealmType {
    let result:RealmType = null;
    switch(realmType) {
      case "file" : result = RealmType.FILE; break;
      case "ldap" : result = RealmType.LDAP; break;
      case "db" : result = RealmType.DB; break;
      case "admin-file" : result = RealmType.ADMIN_FILE; break;
      case "custom" : result = RealmType.CUSTOM; break;
    }
    return result;
  }
}