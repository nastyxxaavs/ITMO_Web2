import { Body, Controller, Get, Post, Redirect, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess, VerifySession, Session as STSession } from 'supertokens-nestjs';
import { UserService } from './user/user.service';
import { Response, Request } from 'express';
import { SuperTokensSession } from 'supertokens-nestjs/dist/supertokens.types';
import Session from 'supertokens-node/recipe/session';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly userService: UserService) {}

  @PublicAccess()
  @Get()
  @Render('general')
  getIndexPage() {
    return {
      isAuthenticated: false,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      user: '',
      customStyle: 'styles/main.css',
      content: "main",
    };
  }


  //Логика для обработки формы входа
  // @PublicAccess()
  // @Post('/main')
  // @Redirect()
  // async login(@Body() body: { username: string; password: string}, @Req() req) {
  //   const user = await this.userService.validateUser(body.username, body.password);
  //   if (user) {
  //     req.session.isAuthenticated = true;
  //     req.session.user = { username: user.username, role: user.role};
  //     return { url: '/main' };
  //   }
  //   else
  //   {
  //     req.session.isAuthenticated = false;
  //     return { url: '/main' };
  //   }
  // }
  //
  //
  // @Get('/logout')
  // @Redirect('/main')
  // logout(@Req() req) {
  //   req.session.destroy(()=>{}) // Сбросить сессию
  //   return { url: '/main' };
  // }
  //
  // @PublicAccess()
  // @Post('/auth/signin')
  // async signIn(@Req() req: Request, @Res() res: Response) {
  //   res.redirect('/main');
  // }
  //
  @PublicAccess()
  @Post('/auth/signout')
  async logOut(@STSession() session: SuperTokensSession | undefined) {
    if (session) {
      await session.revokeSession();
      return { url: '/main' };
    }
  }


  @PublicAccess()
  @Get('/index')
  @VerifySession()
  @Render('general')
  async index(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    return {
      content: "index",
      isAuthenticated: payload.isAuthenticated,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: 'styles/main.css',
      user: payload.username
    };
  }


  @PublicAccess()
  @Get('/main')
  @Render('general')
  async main(@Req() req: Request) {
    let isAuthenticated = false;
    let username = '';

    try {
      const session = await Session.getSession(req, req.res, { sessionRequired: false });
      if (session) {
        const payload = session.getAccessTokenPayload();
        isAuthenticated = payload.isAuthenticated;
        username = payload.username;
      }
    } catch (error) {
      console.log('No valid session', error);
    }

    return {
      content: "main",
      isAuthenticated: isAuthenticated,
      user: username,
      titleContent: 'Рога и копыта: главная',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, наши ценности, достижения',
      descriptionContent: 'Данная страница (главная) содержит описание компании: раздел О нас, окно подачи заявки и всю контактную информацию',
      customStyle: 'styles/main.css',
    };
  }

  @PublicAccess()
  @VerifySession()
  @Get('/services')
  @Render('general')
  async services(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    return {
      content: "services",
      isAuthenticated: payload.isAuthenticated,
      titleContent: 'Рога и копыта: услуги',
      keywordsContent: 'рога и копыта, судебные споры, внешнеэкономическая деятельность, сельское хозяйство, трудовые споры, споры с таможней',
      descriptionContent: 'Данная страница (услуги) содержит описание предоставляемых компанией услуг',
      customStyle: 'styles/services.css',
      user: payload.username
    };
  }

  @PublicAccess()
  @VerifySession()
  @Get('/team')
  @Render('general')
  async team(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    const filePath = 'data/employees.json';
    const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    const leftMembers = data.leftTeamMembers;
    const rightMembers = data.rightTeamMembers;


    return {
      content: "team",
      isAuthenticated: payload.isAuthenticated,
      titleContent: 'Рога и копыта: команда',
      keywordsContent: 'рога и копыта, юридическая помощь, о нас, команда',
      descriptionContent: 'Данная страница (команда) содержит описание членов команды компании',
      customStyle: 'styles/team.css',
      user: payload.username,
      leftTeamMembers: leftMembers,
      rightTeamMembers: rightMembers,
    };
  }

  @PublicAccess()
  @VerifySession()
  @Get('/client_feedbacks')
  @Render('general')
  async feedbacks(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      content: "client_feedbacks",
      isAuthenticated: payload.isAuthenticated,
      titleContent: 'Отзывы о наших услугах',
      customStyle: 'styles/client_feedbacks.css',
      user: payload.username
    };
  }

}
