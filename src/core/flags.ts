import { evaluateFlag } from "./evaluate";

export class LocalFlagsClient<
  TPrisma extends {
    featureFlag: {
      create: (args: any) => Promise<any>;
      update: (args: any) => Promise<any>;
      findUnique: (args: any) => Promise<any>;
      findMany: (args?: any) => Promise<any>;
      delete: (args: any) => Promise<any>;
    };
  }
> {
  private prisma: TPrisma;

  /**
   * Initializes the local flags
   * @param prisma Takes in a prisma client
   * @returns Returns LocalFlagClient object
   */
  constructor(prisma: TPrisma) {
    this.prisma = prisma;
  }

  /**
   * Creates a new feature flag
   * @param data Takes in a feature flag object
   * @returns Returns the created feature flag
   */
  async createFlag(data: Record<string, any>): Promise<any> {
    return this.prisma.featureFlag.create({ data });
  }

  /**
   * Returns all feature flags
   * @returns Returns all feature flags
   */
  async getAllFlags(): Promise<any[]> {
    return this.prisma.featureFlag.findMany();
  }

  /**
   * Returns a feature flag by id
   * @param id Takes in a feature flag id
   * @returns Returns the feature flag
   */
  async getFlag(id: string): Promise<any | null> {
    return this.prisma.featureFlag.findUnique({
      where: { id },
    });
  }

  /**
   * Updates a feature flag by id
   * @param id Takes in a feature flag id
   * @param data Takes in a feature flag object
   * @returns Returns the updated feature flag
   */
  async updateFlag(id: string, data: Record<string, any>): Promise<any> {
    return this.prisma.featureFlag.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a feature flag by id
   * @param id Takes in a feature flag id
   * @returns Returns the deleted feature flag
   */
  async deleteFlag(id: string): Promise<any> {
    return this.prisma.featureFlag.delete({
      where: { id },
    });
  }

  /**
   * Checks if a feature flag is enabled for a user
   * @param flagName Takes in a feature flag name
   * @param userIdentifier Takes in a user identifier. e.g. id, email or username. This is to check if that user is part of the feature flag
   * @param userConditions Takes in a user conditions. e.g. { role: "admin" } to check if that user has the admin role. Make sure it's an object
   * @returns Returns a boolean
   */
  async isEnabled(
    flagName: string,
    userIdentifier: string,
    userConditions: Record<string, any>
  ): Promise<boolean> {
    const flag = await this.getFlag(flagName);
    return evaluateFlag({
      flag,
      userIdentifier,
      userConditions,
    });
  }
}
