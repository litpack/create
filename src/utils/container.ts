import { Container } from 'inversify';
import { HttpInterceptor, MyHttpInterceptor } from '@/utils/http-interceptor';
import { FetchService } from '@/utils/fetch';

const container = new Container();

container.bind<HttpInterceptor>('HttpInterceptor').to(MyHttpInterceptor).inSingletonScope();
container.bind<FetchService>('FetchService').to(FetchService);

export { container };
