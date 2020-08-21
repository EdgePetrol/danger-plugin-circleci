// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import * as _ from "lodash"
import {DangerDSLType} from "../node_modules/danger/distribution/dsl/DangerDSL"
declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

export async function getReportUrlsByBranch(branchName: string, buildName = "build") {
  try {
    const circleCIApiUrl = `https://circleci.com/api/v1.1/project/github/${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}`

    const url = `${circleCIApiUrl}/tree/${branchName}?circle-token=${process.env.CIRCLE_TOKEN}&limit=6&filter=completed`

    const response = await fetch(url)
    const data = await response.json()

    const latestBuild = _.find(data, build => {
      return build.build_parameters.CIRCLE_JOB === buildName
    })

    const currentUrl = await getReportUrl(`${circleCIApiUrl}/${process.env.CIRCLE_BUILD_NUM}/artifacts?circle-token=${process.env.CIRCLE_TOKEN}`)
    const branchUrl = await getReportUrl(`${circleCIApiUrl}/${latestBuild?.build_num}/artifacts?circle-token=${process.env.CIRCLE_TOKEN}`, branchName)

    return { currentUrl, branchUrl }
  } catch (error) {
    return undefined
  }
}

const getReportUrl = async (url: string, branchName?: string) => {
  try {
    const response = await fetch(url)
    const data = await response.json()

    const coverageUrl = _.find(data, artifact => {
      if (!artifact.hasOwnProperty("url")) { return }

      return artifact.url.endsWith("lcov-report/index.html")
    })

    return `${coverageUrl?.url}?circle-token=${process.env.CIRCLE_TOKEN}&branch=${branchName}`
  } catch (error) {
    return undefined
  }
}
