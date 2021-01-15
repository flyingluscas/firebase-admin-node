/*!
 * @license
 * Copyright 2021 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import * as _ from 'lodash';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as mocks from '../../resources/mocks';
import { App, deleteApp } from '../../../src/app/index';
import { instanceId, InstanceId } from '../../../src/instance-id/index';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const expect = chai.expect;

describe('InstanceId', () => {
  let mockApp: App;
  let mockCredentialApp: App;

  const noProjectIdError = 'Failed to determine project ID for InstanceId. Initialize the SDK '
  + 'with service account credentials or set project ID as an app option. Alternatively set the '
  + 'GOOGLE_CLOUD_PROJECT environment variable.';

  beforeEach(() => {
    mockApp = mocks.app();
    mockCredentialApp = mocks.mockCredentialApp();
  });

  afterEach(() => {
    return deleteApp(mockApp);
  });

  describe('instanceId()', () => {
    it('should throw when default app is not available', () => {
      expect(() => {
        return instanceId();
      }).to.throw('The default Firebase app does not exist.');
    });

    it('should reject given an invalid credential without project ID', () => {
      // Project ID not set in the environment.
      delete process.env.GOOGLE_CLOUD_PROJECT;
      delete process.env.GCLOUD_PROJECT;
      const iid = instanceId(mockCredentialApp);
      return iid.deleteInstanceId('iid')
        .should.eventually.rejectedWith(noProjectIdError);
    });

    it('should not throw given a valid app', () => {
      expect(() => {
        return instanceId(mockApp);
      }).not.to.throw();
    });

    it('should return the same instance for a given app instance', () => {
      const iid1: InstanceId = instanceId(mockApp);
      const iid2: InstanceId = instanceId(mockApp);
      expect(iid1).to.equal(iid2);
    });
  });
});