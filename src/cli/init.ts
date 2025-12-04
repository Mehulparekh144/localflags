import chalk from "chalk";
import path from "node:path";
import fs from "node:fs";
import simpleGit from "simple-git";

const SCHEMA_MODEL = `
model FeatureFlag {
    id String @id @default(cuid())
    name String @unique
    description String
    enabled Boolean @default(false)
    rolloutPercentage Int @default(0)
    users Json? // You can change it to whatever you want
    conditions Json? // You can change it to whatever you want  
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
`;

const DASHBOARD_TEMPLATE_GITHUB =
  "https://github.com/Mehulparekh144/localflags-dashboard-template";

const createDashboard = async () => {
  if (fs.existsSync(path.join(process.cwd(), "src/app"))) {
    simpleGit().clone(
      DASHBOARD_TEMPLATE_GITHUB,
      path.join(process.cwd(), "src", "app", "localflags")
    );
    console.log(
      chalk.green(
        "Dashboard created successfully in src/app/localflags-dashboard-template"
      )
    );
    return;
  } else if (fs.existsSync(path.join(process.cwd(), "app"))) {
    simpleGit().clone(
      DASHBOARD_TEMPLATE_GITHUB,
      path.join(process.cwd(), "app", "localflags")
    );
    console.log(
      chalk.green("Dashboard created successfully in app/localflags")
    );
    return;
  }

  console.log(chalk.red("No app directory found. Skipping dashboard creation"));
};

export async function init() {
  console.log(chalk.green("Initializing localflags..."));
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

  if (fs.existsSync(schemaPath)) {
    console.log(chalk.green("Schema Exists. Appending model..."));
    const schemaContent = fs.readFileSync(schemaPath, "utf-8");

    if (schemaContent.includes("FeatureFlag")) {
      console.log(chalk.yellow("FeatureFlag model already exists"));
    } else {
      fs.writeFileSync(schemaPath, schemaContent + "\n" + SCHEMA_MODEL);
      console.log(chalk.green("FeatureFlag model added successfully"));
    }
  } else {
    console.log(chalk.yellow("Schema does not exist. Creating schema..."));
    const SCHEMA_SETUP = `
generator client {
    provider = "prisma-client-js"
    output   = "./generated/prisma"
}

datasource db {
    provider = "sqlite"
}
${SCHEMA_MODEL}
    `;
    fs.mkdirSync(path.join(process.cwd(), "prisma"), { recursive: true });
    fs.writeFileSync(schemaPath, SCHEMA_SETUP);
    console.log(chalk.green("Schema created successfully"));
  }

  createDashboard();

  const NEXT_STEPS = `
  ${chalk.cyan("Next Steps: ")}
    Run npx prisma generate
    Run npx prisma migrate dev
    `;
  console.log(NEXT_STEPS);
}
