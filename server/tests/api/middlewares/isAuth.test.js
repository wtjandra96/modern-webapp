const container = require("typedi").Container;
const logger = require("../../logger");
const { isAuth } = require("../../../src/api/middlewares");

const nextFunction = () => {};
const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZThiYzQ4ZTc1MDgzNTc2YTQ1ZmRlMTciLCJ1c2VybmFtZSI6Ind0amFuZHJhIiwiaWF0IjoxNTg2MjE4MjE2fQ.P-XZkOazGExCN1qNItz7fyBkCSFaAl9XlmarQXXo5W4";
const invalidToken = "invalid token";
const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZThiYzQ4ZTc1MDgzNTc2YTQ1ZmRlMTciLCJ1c2VybmFtZSI6Ind0amFuZHJhIiwiaWF0IjoxNTg2MjE4MjQ0LCJleHAiOjE1ODYyMTgyNDV9.FdnyVJXIIATYTL9HgymrWUU8qsCAGJHq-JhGceZqi3k";

describe("Testing isAuth middleware", () => {
  beforeAll(() => {
    container.set("logger", logger);
  });

  describe("Testing JSON web token validity", () => {
    it("Should not allow invalid token", () => {
      const req = {
        header: () => invalidToken
      };

      let jsonResponse = {};
      const res = {
        query: {},
        headers: {},
        data: null,
        httpStatusCode: null,
        status (statusCode) {
          this.httpStatusCode = statusCode;
          return {
            json (payload) {
              jsonResponse = payload;
            }
          };
        }
      };

      const statusSpy = jest.spyOn(res, "status");

      isAuth(req, res, nextFunction);
      expect(res.httpStatusCode).toStrictEqual(401);

      expect(statusSpy).toHaveBeenCalledTimes(1);
      expect(jsonResponse.success).toStrictEqual(false);
      expect(jsonResponse.msg).toBeDefined();
    });

    it("Should not allow missing token", () => {
      const req = {
        header: () => null
      };

      let jsonResponse = {};
      const res = {
        query: {},
        headers: {},
        data: null,
        httpStatusCode: null,
        status (statusCode) {
          this.httpStatusCode = statusCode;
          return {
            json (payload) {
              jsonResponse = payload;
            }
          };
        }
      };

      const statusSpy = jest.spyOn(res, "status");

      isAuth(req, res, nextFunction);
      expect(res.httpStatusCode).toStrictEqual(401);

      expect(statusSpy).toHaveBeenCalledTimes(1);
      expect(jsonResponse.success).toStrictEqual(false);
      expect(jsonResponse.msg).toBeDefined();
    });

    it("Should not allow expired token", () => {
      const req = {
        header: () => expiredToken
      };

      let jsonResponse = {};
      const res = {
        query: {},
        headers: {},
        data: null,
        httpStatusCode: null,
        status (statusCode) {
          this.httpStatusCode = statusCode;
          return {
            json (payload) {
              jsonResponse = payload;
            }
          };
        }
      };

      const statusSpy = jest.spyOn(res, "status");

      isAuth(req, res, nextFunction);
      expect(res.httpStatusCode).toStrictEqual(401);

      expect(statusSpy).toHaveBeenCalledTimes(1);
      expect(jsonResponse.success).toStrictEqual(false);
      expect(jsonResponse.msg).toBeDefined();
    });

    it("Should allow valid token", () => {
      const req = {
        header: () => validToken
      };
      const res = {};
      isAuth(req, res, nextFunction);

      expect(req.userId).toBeDefined();
    });
  });
});
