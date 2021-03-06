"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../common/types");
const baseLinter_1 = require("./baseLinter");
const types_2 = require("./types");
const REGEX = '(?<file>.py):(?<line>\\d+):(?<column>\\d+): \\[(?<type>\\w+)\\] (?<code>\\w\\d+):? (?<message>.*)\\r?(\\n|$)';
const COLUMN_OFF_SET = 1;
class PyLama extends baseLinter_1.BaseLinter {
    constructor(outputChannel, serviceContainer) {
        super(types_1.Product.pylama, outputChannel, serviceContainer, COLUMN_OFF_SET);
    }
    runLinter(document, cancellation) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.run(['--format=parsable', document.uri.fsPath], document, cancellation, REGEX);
            // All messages in pylama are treated as warnings for now.
            messages.forEach(msg => {
                msg.severity = types_2.LintMessageSeverity.Warning;
            });
            return messages;
        });
    }
}
exports.PyLama = PyLama;
//# sourceMappingURL=pylama.js.map