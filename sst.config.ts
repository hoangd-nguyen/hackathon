import type { SSTConfig } from "sst"

// you can configure your default profiles and regions to use here
const PROFILE = {
  default: "default",
}

const REGION = {
  default: "eu-west-1"
}

const PROJECT_NAME = "hackathon";
const AWS_REGION = "eu-west-1";

export default {
  config(input) {

    // uncomment to use your own default profiles and regions
    const region = undefined // REGION[stage] || REGION.default
    const profile = undefined // PROFILE[stage] || PROFILE.default

    return {
      name: PROJECT_NAME,
      region: AWS_REGION,
      profile: input.stage || "local",
      stage: input.stage,
    }
  },

  async stacks(app) {
    const appStacks = await import("./stacks")
    appStacks.default(app)
  },
} satisfies SSTConfig
