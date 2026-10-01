import { renderToString } from 'react-dom/server';
import PortfolioApp from '../src/app/PortfolioApp';
export const html = renderToString(<PortfolioApp />);
