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

  it("returns undefined without no circle ci envs", async () => {
    expect(await getReportUrlsByBranch("staging")).toBe(undefined)
  })
})
