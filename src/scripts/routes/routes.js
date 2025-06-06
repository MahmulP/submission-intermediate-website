import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import StoryPage from '../pages/story/story-page';
import DetailStoryPage from '../pages/detail-story/detail-story-page';
import NotFoundPage from '../pages/errors/404';

const routes = {
  '/': new HomePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new StoryPage(),
  '/stories/:id': new DetailStoryPage(),
  '*': new NotFoundPage(),
};

export default routes;
