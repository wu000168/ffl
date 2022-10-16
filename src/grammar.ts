
// Generated by peggy v. 2.0.1 (ts-pegjs plugin v. 2.1.0 )
//
// https://peggyjs.org/   https://github.com/metadevpro/ts-pegjs

"use strict";


    import { merge } from "./utils";


export interface IFilePosition {
  offset: number;
  line: number;
  column: number;
}

export interface IFileRange {
  start: IFilePosition;
  end: IFilePosition;
  source: string;
}

export interface ILiteralExpectation {
  type: "literal";
  text: string;
  ignoreCase: boolean;
}

export interface IClassParts extends Array<string | IClassParts> {}

export interface IClassExpectation {
  type: "class";
  parts: IClassParts;
  inverted: boolean;
  ignoreCase: boolean;
}

export interface IAnyExpectation {
  type: "any";
}

export interface IEndExpectation {
  type: "end";
}

export interface IOtherExpectation {
  type: "other";
  description: string;
}

export type Expectation = ILiteralExpectation | IClassExpectation | IAnyExpectation | IEndExpectation | IOtherExpectation;

function peg$padEnd(str: string, targetLength: number, padString: string) {
  padString = padString || ' ';
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}

export class SyntaxError extends Error {
  public static buildMessage(expected: Expectation[], found: string | null) {
    function hex(ch: string): string {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s: string): string {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/"/g,  "\\\"")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,            (ch) => "\\x0" + hex(ch) )
        .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x"  + hex(ch) );
    }

    function classEscape(s: string): string {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/\]/g, "\\]")
        .replace(/\^/g, "\\^")
        .replace(/-/g,  "\\-")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,            (ch) => "\\x0" + hex(ch) )
        .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x"  + hex(ch) );
    }

    function describeExpectation(expectation: Expectation) {
      switch (expectation.type) {
        case "literal":
          return "\"" + literalEscape(expectation.text) + "\"";
        case "class":
          const escapedParts = expectation.parts.map((part) => {
            return Array.isArray(part)
              ? classEscape(part[0] as string) + "-" + classEscape(part[1] as string)
              : classEscape(part);
          });

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        case "any":
          return "any character";
        case "end":
          return "end of input";
        case "other":
          return expectation.description;
      }
    }

    function describeExpected(expected1: Expectation[]) {
      const descriptions = expected1.map(describeExpectation);
      let i: number;
      let j: number;

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found1: string | null) {
      return found1 ? "\"" + literalEscape(found1) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  }

  public message: string;
  public expected: Expectation[];
  public found: string | null;
  public location: IFileRange;
  public name: string;

  constructor(message: string, expected: Expectation[], found: string | null, location: IFileRange) {
    super();
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";

    if (typeof (Object as any).setPrototypeOf === "function") {
      (Object as any).setPrototypeOf(this, SyntaxError.prototype);
    } else {
      (this as any).__proto__ = SyntaxError.prototype;
    }
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, SyntaxError);
    }
  }

  format(sources: { source: string; text: string }[]): string {
    let str = 'Error: ' + this.message;
    if (this.location) {
      let src: string[] | null = null;
      let k;
      for (k = 0; k < sources.length; k++) {
        if (sources[k].source === this.location.source) {
          src = sources[k].text.split(/\r\n|\n|\r/g);
          break;
        }
      }
      let s = this.location.start;
      let loc = this.location.source + ':' + s.line + ':' + s.column;
      if (src) {
        let e = this.location.end;
        let filler = peg$padEnd('', s.line.toString().length, ' ');
        let line = src[s.line - 1];
        let last = s.line === e.line ? e.column : line.length + 1;
        str += '\n --> ' + loc + '\n' + filler + ' |\n' + s.line + ' | ' + line + '\n' + filler + ' | ' +
          peg$padEnd('', s.column - 1, ' ') +
          peg$padEnd('', last - s.column, '^');
      } else {
        str += '\n at ' + loc;
      }
    }
    return str;
  }
}

function peg$parse(input: string, options?: IParseOptions) {
  options = options !== undefined ? options : {};

  const peg$FAILED: Readonly<any> = {};
  const peg$source = options.grammarSource;

  const peg$startRuleFunctions: {[id: string]: any} = { blocks: peg$parseblocks };
  let peg$startRuleFunction: () => any = peg$parseblocks;

  const peg$c0 = function(bs: any): any { return bs.map((b : [any]) => b[0]); };
  const peg$c1 = "{";
  const peg$c2 = peg$literalExpectation("{", false);
  const peg$c3 = "}";
  const peg$c4 = peg$literalExpectation("}", false);
  const peg$c5 = function(s: any, attrs: any): any {
      return {
          selectors: s,
          attributes: attrs
      }
  };
  const peg$c6 = ",";
  const peg$c7 = peg$literalExpectation(",", false);
  const peg$c8 = function(ds: any, td: any): any {
      return  [...ds.map((attr : [any]) => attr[0]), td]
  };
  const peg$c9 = function(ss: any): any {
      return ss.map((s : any) => s[0]);
  };
  const peg$c10 = "$";
  const peg$c11 = peg$literalExpectation("$", false);
  const peg$c12 = function(expr: any): any { return { type : "literal", str: expr }; };
  const peg$c13 = ".";
  const peg$c14 = peg$literalExpectation(".", false);
  const peg$c15 = function(ident: any): any { return  { type : "class", str: ident }; };
  const peg$c16 = ";";
  const peg$c17 = peg$literalExpectation(";", false);
  const peg$c18 = function(ha: any, ta: any): any {
      return [ha, ...ta].reduce((acc : any, ent : { [key : string] : any[] }) => {
          return merge(acc, ent,
              (a: { [key: string]: any }, b: any) => { throw 'value should always be strings'; },
              (arr1: any, arr2: any) => {
                  arr1 ??= [];
                  if (!Array.isArray(arr1)) arr1 = [arr1];
                  return arr1.concat(arr2);
              }
          );
      }, {})
  };
  const peg$c19 = ":";
  const peg$c20 = peg$literalExpectation(":", false);
  const peg$c21 = function(k: any, v: any): any { return { [k.trim()]: v.trim() }; };
  const peg$c22 = "--";
  const peg$c23 = peg$literalExpectation("--", false);
  const peg$c24 = "\\;";
  const peg$c25 = peg$literalExpectation("\\;", false);
  const peg$c26 = peg$anyExpectation();
  const peg$c27 = "\\$";
  const peg$c28 = peg$literalExpectation("\\$", false);
  const peg$c29 = "_";
  const peg$c30 = peg$literalExpectation("_", false);
  const peg$c31 = /^[A-Z]/;
  const peg$c32 = peg$classExpectation([["A", "Z"]], false, false);
  const peg$c33 = /^[a-z]/;
  const peg$c34 = peg$classExpectation([["a", "z"]], false, false);
  const peg$c35 = /^[\-.]/;
  const peg$c36 = peg$classExpectation(["-", "."], false, false);
  const peg$c37 = /^[0-9]/;
  const peg$c38 = peg$classExpectation([["0", "9"]], false, false);
  const peg$c39 = function(): any { return null; };
  const peg$c40 = " ";
  const peg$c41 = peg$literalExpectation(" ", false);
  const peg$c42 = "\t";
  const peg$c43 = peg$literalExpectation("\t", false);
  const peg$c44 = "\r";
  const peg$c45 = peg$literalExpectation("\r", false);
  const peg$c46 = "\n";
  const peg$c47 = peg$literalExpectation("\n", false);
  const peg$c48 = "\v";
  const peg$c49 = peg$literalExpectation("\v", false);
  const peg$c50 = "\f";
  const peg$c51 = peg$literalExpectation("\f", false);

  let peg$currPos = 0;
  let peg$savedPos = 0;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = 0;
  let peg$maxFailExpected: Expectation[] = [];
  let peg$silentFails = 0;

  let peg$result;

  if (options.startRule !== undefined) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text(): string {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location(): IFileRange {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description: string, location1?: IFileRange) {
    location1 = location1 !== undefined
      ? location1
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location1
    );
  }

  function error(message: string, location1?: IFileRange) {
    location1 = location1 !== undefined
      ? location1
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location1);
  }

  function peg$literalExpectation(text1: string, ignoreCase: boolean): ILiteralExpectation {
    return { type: "literal", text: text1, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts: IClassParts, inverted: boolean, ignoreCase: boolean): IClassExpectation {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation(): IAnyExpectation {
    return { type: "any" };
  }

  function peg$endExpectation(): IEndExpectation {
    return { type: "end" };
  }

  function peg$otherExpectation(description: string): IOtherExpectation {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos: number) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos: number, endPos: number): IFileRange {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    return {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected1: Expectation) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected1);
  }

  function peg$buildSimpleError(message: string, location1: IFileRange) {
    return new SyntaxError(message, [], "", location1);
  }

  function peg$buildStructuredError(expected1: Expectation[], found: string | null, location1: IFileRange) {
    return new SyntaxError(
      SyntaxError.buildMessage(expected1, found),
      expected1,
      found,
      location1
    );
  }

  function peg$parseblocks(): any {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parse__();
    if (s1 as any !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parseblock();
      if (s4 as any !== peg$FAILED) {
        s5 = peg$parse__();
        if (s5 as any !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 as any !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parseblock();
        if (s4 as any !== peg$FAILED) {
          s5 = peg$parse__();
          if (s5 as any !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseblock(): any {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseselectorsList();
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parse__();
      if (s2 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 123) {
          s3 = peg$c1;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s3 as any !== peg$FAILED) {
          s4 = peg$parse__();
          if (s4 as any !== peg$FAILED) {
            s5 = peg$parseattributes();
            if (s5 as any !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 as any !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s7 = peg$c3;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c4); }
                }
                if (s7 as any !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c5(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseselectorsList(): any {
    let s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$parsedescendantGroup();
    if (s3 as any !== peg$FAILED) {
      s4 = peg$parse__();
      if (s4 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c6;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c7); }
        }
        if (s5 as any !== peg$FAILED) {
          s6 = peg$parse__();
          if (s6 as any !== peg$FAILED) {
            s3 = [s3, s4, s5, s6];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    while (s2 as any !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$currPos;
      s3 = peg$parsedescendantGroup();
      if (s3 as any !== peg$FAILED) {
        s4 = peg$parse__();
        if (s4 as any !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c6;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c7); }
          }
          if (s5 as any !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 as any !== peg$FAILED) {
              s3 = [s3, s4, s5, s6];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parsedescendantGroup();
      if (s2 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c8(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedescendantGroup(): any {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$parseselector();
    if (s3 as any !== peg$FAILED) {
      s4 = peg$parse__();
      if (s4 as any !== peg$FAILED) {
        s3 = [s3, s4];
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 as any !== peg$FAILED) {
      while (s2 as any !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$parseselector();
        if (s3 as any !== peg$FAILED) {
          s4 = peg$parse__();
          if (s4 as any !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 as any !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c9(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseselector(): any {
    let s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseclazz();
    if (s1 as any === peg$FAILED) {
      s1 = peg$parseliteral();
    }
    if (s1 as any !== peg$FAILED) {
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseliteral(): any {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 36) {
      s1 = peg$c10;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c11); }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      s4 = peg$parselitChar();
      if (s4 as any !== peg$FAILED) {
        while (s4 as any !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parselitChar();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 as any !== peg$FAILED) {
        s2 = input.substring(s2, peg$currPos);
      } else {
        s2 = s3;
      }
      if (s2 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 36) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c11); }
        }
        if (s3 as any !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c12(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseclazz(): any {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 46) {
      s1 = peg$c13;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c14); }
    }
    if (s1 as any !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parseident();
      if (s3 as any !== peg$FAILED) {
        s2 = input.substring(s2, peg$currPos);
      } else {
        s2 = s3;
      }
      if (s2 as any !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c15(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseattributes(): any {
    let s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parseattribute();
    if (s1 as any !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 59) {
        s4 = peg$c16;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s4 as any !== peg$FAILED) {
        s5 = peg$parse__();
        if (s5 as any !== peg$FAILED) {
          s6 = peg$parseattribute();
          if (s6 as any !== peg$FAILED) {
            s3 = s6;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 as any !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 59) {
          s4 = peg$c16;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s4 as any !== peg$FAILED) {
          s5 = peg$parse__();
          if (s5 as any !== peg$FAILED) {
            s6 = peg$parseattribute();
            if (s6 as any !== peg$FAILED) {
              s3 = s6;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s3 = peg$c16;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s3 as any === peg$FAILED) {
          s3 = null;
        }
        if (s3 as any !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c18(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseattribute(): any {
    let s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parsestyleKey();
    if (s1 as any !== peg$FAILED) {
      s2 = peg$parse__();
      if (s2 as any !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s3 = peg$c19;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c20); }
        }
        if (s3 as any !== peg$FAILED) {
          s4 = peg$parse__();
          if (s4 as any !== peg$FAILED) {
            s5 = peg$parsestyleValue();
            if (s5 as any !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 as any !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsestyleKey(): any {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c22) {
      s2 = peg$c22;
      peg$currPos += 2;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c23); }
    }
    if (s2 as any === peg$FAILED) {
      s2 = null;
    }
    if (s2 as any !== peg$FAILED) {
      s3 = peg$parseident();
      if (s3 as any !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 as any !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }

    return s0;
  }

  function peg$parsestyleValue(): any {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    if (input.substr(peg$currPos, 2) === peg$c24) {
      s2 = peg$c24;
      peg$currPos += 2;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c25); }
    }
    if (s2 as any === peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 59) {
        s4 = peg$c16;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s4 as any === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 125) {
          s4 = peg$c3;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
      }
      peg$silentFails--;
      if (s4 as any === peg$FAILED) {
        s3 = undefined;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 as any !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c26); }
        }
        if (s4 as any !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    }
    if (s2 as any !== peg$FAILED) {
      while (s2 as any !== peg$FAILED) {
        s1.push(s2);
        if (input.substr(peg$currPos, 2) === peg$c24) {
          s2 = peg$c24;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s2 as any === peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 59) {
            s4 = peg$c16;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s4 as any === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
          }
          peg$silentFails--;
          if (s4 as any === peg$FAILED) {
            s3 = undefined;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 as any !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c26); }
            }
            if (s4 as any !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 as any !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }

    return s0;
  }

  function peg$parseident(): any {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parsealpha();
    if (s2 as any !== peg$FAILED) {
      s3 = [];
      s4 = peg$parsealnum();
      while (s4 as any !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parsealnum();
      }
      if (s3 as any !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 as any !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }

    return s0;
  }

  function peg$parselitChar(): any {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c27) {
      s1 = peg$c27;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c28); }
    }
    if (s1 as any === peg$FAILED) {
      s1 = peg$currPos;
      s2 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 36) {
        s3 = peg$c10;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c11); }
      }
      peg$silentFails--;
      if (s3 as any === peg$FAILED) {
        s2 = undefined;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 as any !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c26); }
        }
        if (s3 as any !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    }
    if (s1 as any !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }

    return s0;
  }

  function peg$parsealnum(): any {
    let s0;

    s0 = peg$parsealpha();
    if (s0 as any === peg$FAILED) {
      s0 = peg$parsenum();
      if (s0 as any === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 95) {
          s0 = peg$c29;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
      }
    }

    return s0;
  }

  function peg$parsealpha(): any {
    let s0;

    s0 = peg$parselower();
    if (s0 as any === peg$FAILED) {
      s0 = peg$parseupper();
    }

    return s0;
  }

  function peg$parseupper(): any {
    let s0;

    if (peg$c31.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c32); }
    }

    return s0;
  }

  function peg$parselower(): any {
    let s0;

    if (peg$c33.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c34); }
    }

    return s0;
  }

  function peg$parsenum(): any {
    let s0;

    if (peg$c35.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c36); }
    }
    if (s0 as any === peg$FAILED) {
      s0 = peg$parsedigit();
    }

    return s0;
  }

  function peg$parsedigit(): any {
    let s0;

    if (peg$c37.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c38); }
    }

    return s0;
  }

  function peg$parse__(): any {
    let s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 as any !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (s1 as any !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c39();
    }
    s0 = s1;

    return s0;
  }

  function peg$parse_(): any {
    let s0, s1;

    if (input.charCodeAt(peg$currPos) === 32) {
      s0 = peg$c40;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c41); }
    }
    if (s0 as any === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 9) {
        s0 = peg$c42;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s0 as any === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 13) {
          s0 = peg$c44;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c45); }
        }
        if (s0 as any === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s0 = peg$c46;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c47); }
          }
          if (s0 as any === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 11) {
              s0 = peg$c48;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c49); }
            }
            if (s0 as any === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 12) {
                s1 = peg$c50;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c51); }
              }
              if (s1 as any !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39();
              }
              s0 = s1;
            }
          }
        }
      }
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

export interface IParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
export type ParseFunction = (input: string, options?: IParseOptions) => any;
export const parse: ParseFunction = peg$parse;

