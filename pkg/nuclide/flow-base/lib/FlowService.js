'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {NuclideUri} from '../../remote-uri';

// Diagnostic information, returned from findDiagnostics.
export type Diagnostics = {
  // The location of the .flowconfig where these messages came from.
  flowRoot: NuclideUri,
  messages: Array<Diagnostic>,
};

/*
 * Each error or warning can consist of any number of different messages from
 * Flow to help explain the problem and point to different locations that may be
 * of interest.
 */
export type Diagnostic = Array<SingleMessage>;

export type SingleMessage = {
  path: ?NuclideUri,
  descr: string,
  line: number,
  endline: number,
  start: number,
  end: number,
  level: string,
}

export type Loc = {
  file: NuclideUri,
  line: number,
  column: number,
}

// If types are added here, make sure to also add them to FlowConstants.js. This needs to be the
// canonical type definition so that we can use these in the service framework.
export type ServerStatusType =
  'failed' |
  'unknown' |
  'not running' |
  'not installed' |
  'busy' |
  'init' |
  'ready';

export type FlowOutlineTree = {
  displayText: string,
  // Service framework can't serialize Point so we need a slightly different type from the canonical
  // OutlineTree.
  startLine: number,
  startColumn: number,
  children: Array<FlowOutlineTree>,
};

import {findFlowConfigDir} from './FlowHelpers';

import {FlowRoot} from './FlowRoot';

// string rather than NuclideUri because this module will always execute at the location of the
// file, so it will always be a real path and cannot be prefixed with nuclide://
const flowRoots: Map<string, FlowRoot> = new Map();

async function getInstance(file: string): Promise<?FlowRoot> {
  const root = await findFlowConfigDir(file);
  if (root == null) {
    return null;
  }

  let instance = flowRoots.get(root);
  if (!instance) {
    instance = new FlowRoot(root);
    flowRoots.set(root, instance);
  }
  return instance;
}

async function runWithInstance<T>(
  file: string,
  f: (instance: FlowRoot) => Promise<T>
): Promise<?T> {
  const instance = await getInstance(file);
  if (instance == null) {
    return null;
  }

  return await f(instance);
}

export function dispose(): void {
  flowRoots.forEach(instance => instance.dispose());
  flowRoots.clear();
}

export function flowFindDefinition(
  file: NuclideUri,
  currentContents: string,
  line: number,
  column: number
): Promise<?Loc> {
  return runWithInstance(
    file,
    instance => instance.flowFindDefinition(
      file,
      currentContents,
      line,
      column,
    )
  );
}

export function flowFindDiagnostics(
  file: NuclideUri,
  currentContents: ?string
): Promise<?Diagnostics> {
  return runWithInstance(
    file,
    instance => instance.flowFindDiagnostics(
      file,
      currentContents,
    )
  );
}

export function flowGetAutocompleteSuggestions(
  file: NuclideUri,
  currentContents: string,
  line: number,
  column: number,
  prefix: string,
  activatedManually: boolean,
): Promise<any> {
  return runWithInstance(
    file,
    instance => instance.flowGetAutocompleteSuggestions(
      file,
      currentContents,
      line,
      column,
      prefix,
      activatedManually,
    )
  );
}

export async function flowGetType(
  file: NuclideUri,
  currentContents: string,
  line: number,
  column: number,
  includeRawType: boolean,
): Promise<?{type: string, rawType: ?string}> {
  return runWithInstance(
    file,
    instance => instance.flowGetType(
      file,
      currentContents,
      line,
      column,
      includeRawType,
    )
  );
}

export function flowGetOutline(
  currentContents: string,
): Promise<?Array<FlowOutlineTree>> {
  return FlowRoot.flowGetOutline(currentContents);
}
