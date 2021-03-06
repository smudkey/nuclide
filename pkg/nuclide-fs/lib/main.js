/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import {CompositeFileSystem} from './CompositeFileSystem';
import {FsFileSystem} from './FsFileSystem';

export type {DirectoryEntry, ReadOptions, WriteOptions} from './FileSystem';

export {FileSystem} from './FileSystem';

export const ROOT_FS = new CompositeFileSystem(new FsFileSystem());
