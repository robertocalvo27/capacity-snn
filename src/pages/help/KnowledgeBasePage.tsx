import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  FileText, 
  Book, 
  ChevronRight,
  ExternalLink,
  Clock
} from 'lucide-react';

export function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const tutorials = [
    {
      id: 1,
      title: 'Cómo ingresar datos en Vista Tabla',
      duration: '2:30',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300&h=200',
      category: 'Data Entry'
    },
    {
      id: 2,
      title: 'Crear un plan de acción desde Pareto',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300&h=200',
      category: 'Action Plans'
    },
    {
      id: 3,
      title: 'Visualizando métricas en Dashboard',
      duration: '1:50',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300&h=200',
      category: 'Dashboards'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: '¿Qué sucede si un valor está por debajo de la meta?',
      answer: 'Cuando un valor está por debajo de la meta, el sistema automáticamente sugiere crear un plan de acción correctiva. Se mostrará una notificación y podrás iniciar el proceso de análisis de causa raíz.'
    },
    {
      id: 2,
      question: '¿Cómo asignar responsables en un plan de acción?',
      answer: 'En la sección de planes de acción, al crear una nueva acción correctiva, podrás seleccionar responsables de tu organización. Estos recibirán notificaciones sobre sus asignaciones y fechas límite.'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'Mejores prácticas para gestión de KPIs',
      category: 'Gestión',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Guía de seguridad industrial',
      category: 'Safety',
      readTime: '8 min'
    },
    {
      id: 3,
      title: 'Optimización de procesos productivos',
      category: 'Production',
      readTime: '6 min'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Centro de Conocimiento
        </h1>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tutoriales, guías y artículos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Tutoriales en Video
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="group relative">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {tutorial.duration}
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {tutorial.title}
              </h3>
              <p className="text-sm text-gray-500">{tutorial.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-lg hover:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">{faq.question}</h3>
                <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-500">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Artículos Relevantes
        </h2>
        <div className="space-y-4">
          {articles.map((article) => (
            <a
              key={article.id}
              href="#"
              className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {article.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{article.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {article.readTime} lectura
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}