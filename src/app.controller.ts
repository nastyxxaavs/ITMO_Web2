import { Body, Controller, Get, Post, Query, Redirect, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('general')
  getIndexPage(@Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      user: isAuthenticated ? "Nasty" : null,
      customStyle: 'styles/main.css',
      content: "main",
    };
  }

  //Логика для обработки формы входа
  @Post('/main')
  @Redirect()
  login(@Body() body: { username: string; password: string}, @Req() req) {
    if (body.username === 'Nasty' && body.password === '777') {
      //return { url: '/main?auth=true' };
      req.session.isAuthenticated = true; // Сохраняем состояние авторизации
      return { url: '/main' };
    }
    else
    {
      req.session.isAuthenticated = false;
      return { url: '/main' };
    }
  }

  @Get('/logout')
  @Redirect('/main')
  logout(@Req() req) {
    req.session.isAuthenticated = false; // Сбросить сессию
    return { url: '/main' }; // Перенаправить на главную страницу
  }


  @Get('/index')
  @Render('general')
  index(@Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    return {
      content: "index",
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
  main(@Req() req) {
    //const isAuthenticated = auth === 'true';
    const isAuthenticated = req.session.isAuthenticated;
    return {
      content: "main",
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
  services(@Req() req) {
    //const isAuthenticated = auth === 'true';
    const isAuthenticated = req.session.isAuthenticated;
    return {
      content: "services",
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
  async team(@Req() req) {
    //const isAuthenticated = auth === 'true';
    const isAuthenticated = req.session.isAuthenticated;
    const filePath = 'data/employees.json';
    const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    const leftMembers = data.leftTeamMembers;
    const rightMembers = data.rightTeamMembers;


    return {
      content: "team",
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
  feedbacks(@Req() req) {
    //const isAuthenticated = auth === 'true';
    const isAuthenticated = req.session.isAuthenticated;
    return {
      content: "client_feedbacks",
      isAuthenticated,
      titleContent: 'Отзывы о наших услугах',
      customStyle: 'styles/client_feedbacks.css',
      user: isAuthenticated ? "Anastasia" : null
    };
  }

}
