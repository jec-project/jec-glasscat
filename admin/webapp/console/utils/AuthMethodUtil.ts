
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

import {AuthMethod} from "jec-exchange";

/**
 * A utility class that provides functionalities for working with auth methods.
 */
export class AuthMethodUtil {

  /**
   * Resolves the specified string to a valid <code>AuthAuthMethodMetho</code>
   * value.
   * 
   * @param {string} authMethod a string that represents the type of an auth
   *                          method.
   * @return {AuthMethod} the <code>AuthMethod</code> that corresponds to the
   *                      specified auth method value.
   */
  public static resolveAuthMethod(authMethod:string):AuthMethod {
    let result:AuthMethod = null;
    switch(authMethod) {
      case "none" : result = AuthMethod.NONE; break;
      case "form" : result = AuthMethod.FORM; break;
      case "ejp-form" : result = AuthMethod.EJP_FORM; break;
      case "basic" : result = AuthMethod.BASIC; break;
      case "digest" : result = AuthMethod.DIGEST; break;
    }
    return result;
  }
}