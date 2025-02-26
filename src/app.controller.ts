import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  @Render('general')
  getIndexPage(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      user: isAuthenticated ? {name: "Anastasia"} : null
    };
  }


  @Get('/index')
  @Render('general')
  index(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: '../public/styles/main.css',
      user: isAuthenticated ? {name: "Anastasia"} : null
    };
  }

  @Get('/main')
  @Render('general')
  main(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: '../public/styles/main.css',
      user: isAuthenticated ? {name: "Anastasia"} : null
    };
  }

  @Get('/services')
  @Render('general')
  services(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: услуги',
      keywordsContent: 'рога и копыта, судебные споры, внешнеэкономическая деятельность, сельское хозяйство, трудовые споры, споры с таможней',
      descriptionContent: 'Данная страница (услуги) содержит описание предоставляемых компанией услуг',
      customStyle: '../public/styles/services.css',
      user: isAuthenticated ? {name: "Anastasia"} : null
    };
  }

  @Get('/team')
  @Render('general')
  async team(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    const filePath = path.join(__dirname, '../employees.json');
    const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    const leftMembers = data.leftTeamMembers;
    const rightMembers = data.rightTeamMembers;


    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: команда',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, команда',
      descriptionContent: 'Данная страница (команда) содержит описание членов команды компании',
      customStyle: '../public/styles/team.css',
      user: isAuthenticated ? { name: "Anastasia" } : null,
      leftTeamMembers: leftMembers,
      rightTeamMembers: rightMembers,
    };
  }

  @Get('/client_feedbacks')
  @Render('general')
  feedbacks(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      isAuthenticated,
      titleContent: 'Отзывы о наших услугах',
      customStyle: '../public/styles/client_feedbacks.css',
      user: isAuthenticated ? {name: "Anastasia"} : null
    };
  }

}
