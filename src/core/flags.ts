import type { PrismaClient } from "@prisma/client";
import { evaluateFlag } from "./evaluate";

export class LocalFlagsClient {
  private prisma: PrismaClient;

  /**
   * Initializes the local flags
   * @param prisma Takes in a prisma client
   * @returns Returns
   */
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Creates a new feature flag
   * @param data Takes in a feature flag object
   * @returns Returns the created feature flag
   */
  async createFlag(data: any): Promise<any> {
    return await this.prisma.featureFlag.create({
      data,
    });
  }

  /**
   * Returns all feature flags
   * @returns Returns all feature flags
   */
  async getAllFlags(): Promise<any> {
    return await this.prisma.featureFlag.findMany();
  }

  /**
   * Returns a feature flag by name
   * @param name Takes in a feature flag name
   * @returns Returns the feature flag
   */
  async getFlag(name: string): Promise<any> {
    return await this.prisma.featureFlag.findUnique({
      where: {
        name,
      },
    });
  }

  /**
   * Updates a feature flag by id
   * @param id Takes in a feature flag id
   * @param data Takes in a feature flag object
   * @returns Returns the updated feature flag
   */
  async updateFlag(id: string, data: any): Promise<any> {
    return await this.prisma.featureFlag.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Deletes a feature flag by id
   * @param id Takes in a feature flag id
   * @returns Returns the deleted feature flag
   */
  async deleteFlag(id: string): Promise<any> {
    return await this.prisma.featureFlag.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Checks if a feature flag is enabled for a user
   * @param flagName Takes in a feature flag name
   * @param userIdentifier Takes in a user identifier. e.g. id, email or username. This is to check if that user is part of the feature flag
   * @param userConditions Takes in a user conditions. e.g. { role: "admin" } to check if that user has the admin role. Make sure it's an object
   * @returns Returns a boolean
   */
  async isEnabled({
    flagName,
    userIdentifier,
    userConditions,
  }: {
    flagName: string;
    userIdentifier: string;
    userConditions: Record<string, any> | null;
  }): Promise<boolean> {
    const flag = await this.getFlag(flagName);
    return evaluateFlag({
      flag,
      userIdentifier,
      userConditions,
    });
  }
}
