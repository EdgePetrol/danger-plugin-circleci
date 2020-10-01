import { getReportUrlsByBranch } from "./index"

declare const global: any

describe("#getReportUrlsByBranch(branch)", () => {
  beforeEach(() => {
    global.warn = jest.fn()
    global.message = jest.fn()
    global.fail = jest.fn()
    global.markdown = jest.fn()
  })

  afterEach(() => {
    global.warn = undefined
    global.message = undefined
    global.fail = undefined
    global.markdown = undefined
  })

  describe("without CI envs", () => {
    it("returns undefined without no circle ci envs", async () => {
      expect(await getReportUrlsByBranch("staging")).toBe(undefined)
    })
  })

  describe("with valid artifacts", () => {
    beforeEach(() => {
      const buildJson = require('./test-files/build.json')
      const artifactsJson = require('./test-files/artifacts.json')

      const mockSuccessResponse = (url: string) => {

        if (url.match(/circle-token=xxx&limit=6/)) {
          return buildJson
        } else {
          return artifactsJson
        }
      }
      const mockJsonPromise = (url: string) => Promise.resolve(mockSuccessResponse(url))
      const mockFetchPromise = (url: string) => Promise.resolve({
        json: () => mockJsonPromise(url),
      })
      global.fetch = jest.fn().mockImplementation((url: string) => mockFetchPromise(url))

      jest.resetModules()

      process.env = Object.assign(
        process.env,
        {
          CIRCLE_PROJECT_USERNAME: 'EdgePetrol',
          CIRCLE_PROJECT_REPONAME: 'danger-plugin-circleci',
          CIRCLE_TOKEN: 'xxx',
          CIRCLE_BUILD_NUM: 8,
        },
      )
    })

    afterAll(() => {
      global.fetch.mockClear()

      delete global.fetch
    })

    it("returns correct urls", async () => {
      expect(await getReportUrlsByBranch("master")).toEqual(
        {
          "branchUrl": "https://xxx.circle-artifacts.com/0/lcov-report/index.html?circle-token=xxx&branch=master",
          "currentUrl": "https://xxx.circle-artifacts.com/0/lcov-report/index.html?circle-token=xxx&branch=undefined",
        },
      )
    })
  })

  describe("with no artifacts", () => {
    beforeEach(() => {
      const buildJson = require('./test-files/build.json')
      const artifactsJson = require('./test-files/no-artifacts.json')

      const mockSuccessResponse = (url: string) => {

        if (url.match(/circle-token=xxx&limit=6/)) {
          return buildJson
        } else {
          return artifactsJson
        }
      }
      const mockJsonPromise = (url: string) => Promise.resolve(mockSuccessResponse(url))
      const mockFetchPromise = (url: string) => Promise.resolve({
        json: () => mockJsonPromise(url),
      })
      global.fetch = jest.fn().mockImplementation((url: string) => mockFetchPromise(url))

      jest.resetModules()

      process.env = Object.assign(
        process.env,
        {
          CIRCLE_PROJECT_USERNAME: 'EdgePetrol',
          CIRCLE_PROJECT_REPONAME: 'danger-plugin-circleci',
          CIRCLE_TOKEN: 'xxx',
          CIRCLE_BUILD_NUM: 8,
        },
      )
    })

    afterAll(() => {
      global.fetch.mockClear()

      delete global.fetch
    })

    it("returns correct urls", async () => {
      expect(await getReportUrlsByBranch("master")).toEqual(
        {
          "branchUrl": "undefined?circle-token=xxx&branch=master",
          "currentUrl": "undefined?circle-token=xxx&branch=undefined",
        },
      )
    })
  })

  describe("with error fetching artifacts", () => {
    beforeEach(() => {
      const buildJson = require('./test-files/build.json')
      const artifactsJson = require('./test-files/no-artifacts.json')
      const mockSuccessResponse = (url: string) => {
        return buildJson
      }
      const mockJsonPromise = (url: string) => Promise.resolve(mockSuccessResponse(url))
      const mockFetchPromise = (url: string) => {
        if (url.match(/circle-token=xxx&limit=6/)) {
          return Promise.resolve({
            json: () => mockJsonPromise(url),
          })
        }
      }
      global.fetch = jest.fn().mockImplementation((url: string) => mockFetchPromise(url))

      jest.resetModules()

      process.env = Object.assign(
        process.env,
        {
          CIRCLE_PROJECT_USERNAME: 'EdgePetrol',
          CIRCLE_PROJECT_REPONAME: 'danger-plugin-circleci',
          CIRCLE_TOKEN: 'xxx',
          CIRCLE_BUILD_NUM: 8,
        },
      )
    })

    afterAll(() => {
      global.fetch.mockClear()

      delete global.fetch
    })

    it("returns correct urls", async () => {
      expect(await getReportUrlsByBranch("master")).toEqual(
        {
          "branchUrl": undefined,
          "currentUrl": undefined,
        },
      )
    })
  })
})
