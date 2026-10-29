import 'dotenv/config';
import { App } from './infrastructure/config/app';

const { application } = new App();
application();
