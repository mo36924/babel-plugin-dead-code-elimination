import { transformAsync, TransformOptions } from "@babel/core";
import { describe, test, expect } from "@jest/globals";
import plugin from "./index";

const options: TransformOptions = {
  babelrc: false,
  configFile: false,
  plugins: [[plugin]],
};

const transform = (code: string) => transformAsync(code, options);

describe("babel-plugin-dead-code-elimination", () => {
  test("if", async () => {
    const result = await transform(`
      if(true){
        console.log(true)
      }else{
        console.log(false)
      }
    `);

    expect(result).toMatchInlineSnapshot(`console.log(true);`);
  });

  test("conditional", async () => {
    const result = await transform(`
      const a = true ? 1 : 2
    `);

    expect(result).toMatchInlineSnapshot(`const a = 1;`);
  });

  test("replace", async () => {
    let result = await transform(`
      if("test" === "test")
        a = 1
    `);

    expect(result).toMatchInlineSnapshot(`a = 1;`);

    result = await transform(`
      if("test" === "development")
        a = 1
    `);

    expect(result).toMatchInlineSnapshot(``);

    result = await transform(`
      if("test" === "production"){
        console.log("production")
      }else if("test" === "development"){
        console.log("development")
      }else if("test" === "test"){
        console.log("test")
      }else{
        console.log("unknown")
      }
    `);

    expect(result).toMatchInlineSnapshot(`console.log("test");`);

    result = await transform(`
      if("test" === "production"){
        console.log("production")
      }else if("test" === "development"){
        console.log("development")
      }else{
        console.log("unknown")
      }
    `);

    expect(result).toMatchInlineSnapshot(`console.log("unknown");`);

    result = await transform(`
      if(a === "production"){
        console.log("production")
      }else if("test" === "test"){
        console.log("test")
      }else{
        console.log("unknown")
      }
    `);

    expect(result).toMatchInlineSnapshot(`
      if (a === "production") {
        console.log("production");
      } else {
        console.log("test");
      }
    `);
  });
});
