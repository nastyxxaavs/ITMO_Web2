import { Body, Controller, Get, Post, Query, Redirect, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess } from './auth/public-access.decorator';
import { UserService } from './user/user.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly userService: UserService) {}

  @PublicAccess()
  @Get()
  @Render('general')
  getIndexPage(@Req() req) {
    const isAuthenticated = req.session?.isAuthenticated;
    const user = req.session?.user?.username;
    return {
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      user,
      customStyle: 'styles/main.css',
      content: "main",
    };
  }

  //Логика для обработки формы входа
  @PublicAccess()
  @Post('/main')
  @Redirect()
  async login(@Body() body: { username: string; password: string}, @Req() req) {
    const user = await this.userService.validateUser(body.username, body.password);
    if (user) {
      req.session.isAuthenticated = true;
      req.session.user = { username: user.username, role: user.role};
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
    req.session.destroy(()=>{}) // Сбросить сессию
    return { url: '/main' };
  }


  @PublicAccess()
  @Get('/index')
  @Render('general')
  index(@Req() req) {
    const isAuthenticated = req.session?.isAuthenticated || false;
    const user = req.session?.user?.username || null;
    return {
      content: "index",
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: 'styles/main.css',
      user
    };
  }

  @PublicAccess()
  @Get('/main')
  @Render('general')
  main(@Req() req) {
    const isAuthenticated = req.session?.isAuthenticated || false;
    const user = req.session?.user?.username || null;
    return {
      content: "main",
      isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: 'styles/main.css',
      user
    };
  }

  @PublicAccess()
  @Get('/services')
  @Render('general')
  services(@Req() req) {
    const isAuthenticated = req.session?.isAuthenticated || false;
    const user = req.session?.user?.username || null;
    return {
      content: "services",
      isAuthenticated,
      titleContent: 'Рога и копыта: услуги',
      keywordsContent: 'рога и копыта, судебные споры, внешнеэкономическая деятельность, сельское хозяйство, трудовые споры, споры с таможней',
      descriptionContent: 'Данная страница (услуги) содержит описание предоставляемых компанией услуг',
      customStyle: 'styles/services.css',
      user
    };
  }

  @PublicAccess()
  @Get('/team')
  @Render('general')
  async team(@Req() req) {
    const isAuthenticated = req.session?.isAuthenticated || false;
    const user = req.session?.user?.username || null;
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
      user,
      leftTeamMembers: leftMembers,
      rightTeamMembers: rightMembers,
    };
  }

  @PublicAccess()
  @Get('/client_feedbacks')
  @Render('general')
  feedbacks(@Req() req) {
    const isAuthenticated = req.session?.isAuthenticated || false;
    const user = req.session?.user?.username || null;

    return {
      content: "client_feedbacks",
      isAuthenticated,
      titleContent: 'Отзывы о наших услугах',
      customStyle: 'styles/client_feedbacks.css',
      user
    };
  }

}
