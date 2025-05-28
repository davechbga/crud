
import { useState } from 'react';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Guía de React Hooks',
    description: 'Documentación completa sobre el uso de React Hooks en aplicaciones modernas.',
    category: 'Documentación',
    linkUrl: 'https://react.dev/reference/react',
    createdAt: '2024-05-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Herramientas de Testing',
    description: 'Lista de herramientas recomendadas para testing de aplicaciones web.',
    category: 'Herramientas',
    linkUrl: 'https://testing-library.com/',
    createdAt: '2024-05-18T14:30:00Z'
  },
  {
    id: '3',
    title: 'Tutorial de TypeScript',
    description: 'Guía paso a paso para aprender TypeScript desde cero.',
    category: 'Tutoriales',
    linkUrl: 'https://www.typescriptlang.org/docs/',
    createdAt: '2024-05-15T09:15:00Z'
  }
];

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>(mockResources);

  const addResource = (resourceData: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setResources(prev => [newResource, ...prev]);
  };

  const updateResource = (id: string, resourceData: Omit<Resource, 'id' | 'createdAt'>) => {
    setResources(prev => prev.map(resource => 
      resource.id === id 
        ? { ...resource, ...resourceData }
        : resource
    ));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  return {
    resources,
    addResource,
    updateResource,
    deleteResource
  };
};
