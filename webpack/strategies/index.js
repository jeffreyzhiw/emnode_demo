// import frontend from './frontend';
// import backend from './backend';
import optimize from './optimize';
import devServer from './devServer';
import eslint from './eslint';
import style from './style';

export default (type) => {
  if (type === 'client') {
    return [devServer, eslint, optimize];
  }
  if (type === 'server') {
    return [eslint];
  }
  return [];
};
