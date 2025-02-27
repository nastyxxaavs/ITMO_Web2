import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('general')
  getIndexPage(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      user: isAuthenticated ? "Anastasia" : null
    };
  }


  @Get('/index')
  @Render('general')
  index(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      content: "content/index",
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: 'styles/main.css',
      user: isAuthenticated ? "Anastasia" : null
    };
  }

  @Get('/main')
  @Render('general')
  main(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      content: "content/main",
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: 'styles/main.css',
      user: isAuthenticated ? "Anastasia" : null
    };
  }

  @Get('/services')
  @Render('general')
  services(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      content: "content/services",
      isAuthenticated,
      titleContent: 'Рога и копыта: услуги',
      keywordsContent: 'рога и копыта, судебные споры, внешнеэкономическая деятельность, сельское хозяйство, трудовые споры, споры с таможней',
      descriptionContent: 'Данная страница (услуги) содержит описание предоставляемых компанией услуг',
      customStyle: 'styles/services.css',
      user: isAuthenticated ? "Anastasia" : null
    };
  }

  @Get('/team')
  @Render('general')
  async team(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    const filePath = 'data/employees.json';
    const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    const leftMembers = data.leftTeamMembers;
    const rightMembers = data.rightTeamMembers;


    return {
      content: "content/team",
      isAuthenticated,
      titleContent: 'Рога и копыта: команда',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, команда',
      descriptionContent: 'Данная страница (команда) содержит описание членов команды компании',
      customStyle: 'styles/team.css',
      user: isAuthenticated ? "Anastasia"  : null,
      leftTeamMembers: leftMembers,
      rightTeamMembers: rightMembers,
    };
  }

  @Get('/client_feedbacks')
  @Render('general')
  feedbacks(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      content: "content/client_feedbacks",
      isAuthenticated,
      titleContent: 'Отзывы о наших услугах',
      customStyle: 'styles/client_feedbacks.css',
      user: isAuthenticated ? "Anastasia" : null
    };
  }

}
