import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { ClientsModule } from './modules/clients/clients.module.js';

@Module({
  imports: [
    PrismaModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}