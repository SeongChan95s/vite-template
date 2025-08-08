import { createBrowserRouter } from 'react-router-dom';

interface RouteModule {
  default: React.ComponentType;
}

// app 디렉토리의 모든 .tsx 파일을 동적으로 import
const modules = import.meta.glob('./app/**/*.tsx', { eager: true }) as Record<string, RouteModule>;

// 파일 경로를 라우트 경로로 변환하는 함수
function getRouteFromPath(filePath: string): string {
  // './app/' 제거
  let route = filePath.replace('./app', '');
  
  // '.tsx' 확장자 제거
  route = route.replace('.tsx', '');
  
  // index 파일은 해당 디렉토리의 루트로 처리
  route = route.replace(/\/index$/, '');
  
  // 빈 문자열은 루트 경로로 처리
  if (route === '' || route === '/') {
    route = '/';
  }
  
  // 동적 라우트 처리: [id] -> :id
  route = route.replace(/\[([^\]]+)\]/g, ':$1');
  
  return route;
}

// 라우트 객체 생성
const routes = Object.entries(modules).map(([filePath, module]) => {
  const path = getRouteFromPath(filePath);
  
  // 404 페이지는 특별 처리
  if (filePath.includes('404.tsx')) {
    return {
      path: '*',
      element: <module.default />,
    };
  }
  
  return {
    path,
    element: <module.default />,
  };
});

// 라우터 생성
export const router = createBrowserRouter(routes);