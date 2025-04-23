// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import {
//   EnterIcon,
//   GridIcon,
//   ListBulletIcon,
//   StarFilledIcon,
//   UploadIcon,
// } from '@radix-ui/react-icons';
// import { useParams } from 'next/navigation';
// import { Locale } from '@/app/i18n/config';
// import {
//   agentsData as initialAgentsData,
//   translations,
// } from '@/constants/contractInfo';
// import UploadAgentModal from '@/components/dashboard/UploadAgentModal';
// import MCPServiceInfo from '@/components/dashboard/MCPServiceInfo';

// interface Agent {
//   id: number;
//   name: string;
//   category: string;
//   description: string;
//   imageUrl: string;
//   rating: number;
//   reviews: number;
//   price: number;
//   tags: string[];
//   abilities: string[];
//   popular: boolean;
// }

// interface AgentsDataType {
//   [key: string]: Agent[];
// }

// // 修复初始数据中的重复ID问题
// function fixDuplicateIds(data: AgentsDataType): AgentsDataType {
//   const fixed = { ...data };

//   // 对每种语言的数据进行处理
//   Object.keys(fixed).forEach((lang) => {
//     // 深拷贝数组，避免修改原始对象
//     const agents = JSON.parse(JSON.stringify(fixed[lang]));
//     const seenIds = new Map(); // 用于追踪已经见过的ID

//     // 修复重复ID
//     for (let i = 0; i < agents.length; i++) {
//       const agent = agents[i];
//       if (seenIds.has(agent.id)) {
//         // 找到当前最大ID值（全局范围内）
//         const maxId = Math.max(
//           ...Object.values(fixed)
//             .flat()
//             .map((a: Agent) => a.id),
//           0
//         );
//         // 分配一个新ID (最大ID + 1)
//         agent.id = maxId + 1;
//       }
//       seenIds.set(agent.id, agent.name);
//     }

//     fixed[lang] = agents;
//   });

//   return fixed;
// }

// export default function AIMarketplace() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   // 初始化数据时，先修复可能的重复ID
//   const [agentsData, setAgentsData] = useState<AgentsDataType>(
//     fixDuplicateIds(initialAgentsData)
//   );

//   // 获取当前语言
//   const params = useParams();
//   const lang = (params?.lang as Locale) || 'en';
//   const t = translations[lang];

//   // Add translations for DeFi if missing
//   if (!t.categories.defi) {
//     t.categories.defi = lang === 'zh' ? 'DeFi金融' : 'DeFi';
//   }

//   // Add translations for upload modal if missing
//   if (!t.upload) {
//     t.upload = lang === 'zh' ? '上传' : 'Upload';
//   }
//   if (!t.cancel) {
//     t.cancel = lang === 'zh' ? '取消' : 'Cancel';
//   }
//   if (!t.agentName) {
//     t.agentName = lang === 'zh' ? '代理名称' : 'Agent Name';
//   }
//   if (!t.description) {
//     t.description = lang === 'zh' ? '描述' : 'Description';
//   }
//   if (!t.category) {
//     t.category = lang === 'zh' ? '类别' : 'Category';
//   }
//   if (!t.selectCategory) {
//     t.selectCategory = lang === 'zh' ? '选择类别' : 'Select Category';
//   }
//   if (!t.commaSeparated) {
//     t.commaSeparated = lang === 'zh' ? '用逗号分隔' : 'Comma Separated';
//   }

//   // 获取分类列表
//   const categories = [
//     { id: 'all', name: t.categories.all },
//     { id: 'Finance', name: t.categories.finance },
//     { id: 'Development', name: t.categories.development },
//     { id: 'Data', name: t.categories.data },
//     { id: 'Content', name: t.categories.content },
//     { id: 'Legal', name: t.categories.legal },
//     { id: 'Marketing', name: t.categories.marketing },
//     { id: 'Research', name: t.categories.research },
//     { id: 'Healthcare', name: t.categories.healthcare },
//     { id: 'DeFi', name: t.categories.defi },
//   ];

//   // 生成全局唯一ID的函数
//   const generateUniqueId = () => {
//     // 获取所有语言中所有Agent的ID
//     const allIds = Object.values(agentsData)
//       .flat()
//       .map((agent) => agent.id);

//     // 如果没有ID，从1开始
//     if (allIds.length === 0) return 1;

//     // 否则返回最大ID + 1
//     return Math.max(...allIds) + 1;
//   };

//   // Handle agent upload - 修复后的代码
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleAgentUpload = (formData: any) => {
//     // 使用全局唯一ID生成函数
//     const newId = generateUniqueId();

//     const newAgent: Agent = {
//       id: newId,
//       name: formData.name,
//       category: formData.category,
//       description: formData.description,
//       imageUrl: formData.imageUrl || '/images/agent-default.png',
//       rating: 0,
//       reviews: 0,
//       price: formData.price,
//       tags: formData.tags,
//       abilities: formData.abilities,
//       popular: false,
//     };

//     setAgentsData((prevData) => {
//       const updatedData = { ...prevData };
//       updatedData[lang] = [...updatedData[lang], newAgent];
//       return updatedData;
//     });
//   };

//   // 过滤和搜索逻辑
//   const filteredAgents = agentsData[lang].filter((agent) => {
//     const matchesSearch =
//       searchQuery === '' ||
//       agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.tags.some((tag) =>
//         tag.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//     const matchesCategory =
//       selectedCategory === 'all' || agent.category === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="bg-gray-50 min-h-screen pb-16">
//       <MCPServiceInfo language="en" />
//       {/* 顶部搜索区域 */}
//       <div className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="relative flex-1 w-full">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <EnterIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder={t.search}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="flex items-center space-x-4 self-end">
//               <button
//                 onClick={() => setShowUploadModal(true)}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
//               >
//                 <UploadIcon className="w-4 h-4 mr-2" />
//                 {t.uploadAgent}
//               </button>
//               <div className="hidden sm:flex space-x-2 items-center">
//                 <button
//                   className={`p-1.5 rounded-md ${
//                     viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
//                   }`}
//                   onClick={() => setViewMode('grid')}
//                   aria-label="网格视图"
//                 >
//                   <GridIcon className="h-5 w-5 text-gray-700" />
//                 </button>
//                 <button
//                   className={`p-1.5 rounded-md ${
//                     viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
//                   }`}
//                   onClick={() => setViewMode('list')}
//                   aria-label="列表视图"
//                 >
//                   <ListBulletIcon className="h-5 w-5 text-gray-700" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* 分类导航 */}
//           <div className="mt-4 -mb-px flex space-x-6 overflow-x-auto pb-1 hide-scrollbar">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
//                   selectedCategory === category.id
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//                 onClick={() => setSelectedCategory(category.id)}
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 主要内容区域 */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* 热门AI Agent横幅 */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             {t.popularAgents}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {agentsData[lang]
//               .filter((agent) => agent.popular)
//               .slice(0, 3)
//               .map((agent, index) => (
//                 <div
//                   key={`${lang}-popular-${agent.id}-${index}`} // 添加多个唯一因素
//                   className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
//                 >
//                   <div className="p-4">
//                     <div className="flex items-start">
//                       <div className="h-16 w-16 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
//                         {agent.imageUrl ? (
//                           <Image
//                             src={agent.imageUrl}
//                             alt={agent.name}
//                             className="w-full h-full object-cover"
//                             width={64}
//                             height={64}
//                             onError={(
//                               e: React.SyntheticEvent<HTMLImageElement>
//                             ) => {
//                               const target = e.target as HTMLImageElement;
//                               target.onerror = null;
//                               target.src = '/images/agent-default.png';
//                               // 如果默认图像也加载失败，则回退到显示首字母
//                               target.onerror = () => {
//                                 if (target.parentElement) {
//                                   target.style.display = 'none';
//                                   const fallbackEl =
//                                     target.parentElement.querySelector(
//                                       '.fallback-text'
//                                     );
//                                   if (fallbackEl) {
//                                     (fallbackEl as HTMLElement).style.display =
//                                       'flex';
//                                   }
//                                 }
//                               };
//                             }}
//                           />
//                         ) : (
//                           <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold fallback-text">
//                             {agent.name.charAt(0)}
//                           </div>
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <div className="flex items-center justify-between">
//                           <h3 className="text-lg font-semibold text-gray-900">
//                             {agent.name}
//                           </h3>
//                           <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             {
//                               categories.find((c) => c.id === agent.category)
//                                 ?.name
//                             }
//                           </span>
//                         </div>
//                         <div className="flex items-center mt-1">
//                           <StarFilledIcon className="h-4 w-4 text-yellow-400" />
//                           <span className="text-sm text-gray-700 ml-1">
//                             {agent.rating}
//                           </span>
//                           <span className="text-xs text-gray-500 ml-1">
//                             ({agent.reviews} {t.reviews})
//                           </span>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600 line-clamp-2">
//                           {agent.description}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="mt-4">
//                       <div className="flex flex-wrap gap-2">
//                         {agent.tags.slice(0, 3).map((tag) => (
//                           <span
//                             key={tag}
//                             className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="mt-4 flex justify-between items-center">
//                       <span className="text-gray-900 font-semibold">
//                         {agent.price} {t.pricePerUse}
//                       </span>
//                       <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                         {t.viewDetails}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* 所有AI Agent列表 */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">
//               {t.allAgents}
//             </h2>
//             <span className="text-sm text-gray-500">
//               {filteredAgents.length} {t.results}
//             </span>
//           </div>

//           {/* 网格视图 */}
//           {viewMode === 'grid' && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredAgents.map((agent, index) => (
//                 <div
//                   key={`${lang}-grid-${agent.id}-${index}`} // 添加多个唯一因素
//                   className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
//                 >
//                   <div className="p-4">
//                     <div className="flex items-center">
//                       <div className="h-12 w-12 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
//                         {agent.imageUrl ? (
//                           <Image
//                             src={agent.imageUrl}
//                             alt={agent.name}
//                             height={48}
//                             width={48}
//                             className="w-full h-full object-cover"
//                             onError={(
//                               e: React.SyntheticEvent<HTMLImageElement>
//                             ) => {
//                               const target = e.target as HTMLImageElement;
//                               target.onerror = null;
//                               target.src = '/images/agent-default.png';
//                               // 如果默认图像也加载失败，则回退到显示首字母
//                               target.onerror = () => {
//                                 if (target.parentElement) {
//                                   target.style.display = 'none';
//                                   const fallbackEl =
//                                     target.parentElement.querySelector(
//                                       '.fallback-text'
//                                     );
//                                   if (fallbackEl) {
//                                     (fallbackEl as HTMLElement).style.display =
//                                       'flex';
//                                   }
//                                 }
//                               };
//                             }}
//                           />
//                         ) : (
//                           <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold fallback-text">
//                             {agent.name.charAt(0)}
//                           </div>
//                         )}
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-base font-medium text-gray-900">
//                           {agent.name}
//                         </h3>
//                         <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
//                           {
//                             categories.find((c) => c.id === agent.category)
//                               ?.name
//                           }
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center mt-2">
//                       <StarFilledIcon className="h-3.5 w-3.5 text-yellow-400" />
//                       <span className="text-sm text-gray-700 ml-1">
//                         {agent.rating}
//                       </span>
//                       <span className="text-xs text-gray-500 ml-1">
//                         ({agent.reviews})
//                       </span>
//                       <span className="ml-auto text-gray-900 font-medium text-sm">
//                         {agent.price} {t.pricePerUse}
//                       </span>
//                     </div>
//                     <p className="mt-2 text-sm text-gray-600 line-clamp-2">
//                       {agent.description}
//                     </p>
//                     <div className="mt-3">
//                       <div className="flex flex-wrap gap-1.5">
//                         {agent.tags.slice(0, 2).map((tag) => (
//                           <span
//                             key={tag}
//                             className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                         {agent.tags.length > 2 && (
//                           <span className="text-xs text-gray-500">
//                             +{agent.tags.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <button className="mt-3 w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                       {t.viewDetails}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* 列表视图 */}
//           {viewMode === 'list' && (
//             <div className="space-y-4">
//               {filteredAgents.map((agent, index) => (
//                 <div
//                   key={`${lang}-list-${agent.id}-${index}`} // 添加多个唯一因素
//                   className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
//                 >
//                   <div className="p-4 sm:p-6">
//                     <div className="flex flex-col sm:flex-row sm:items-start">
//                       <div className="h-14 w-14 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
//                         {agent.imageUrl ? (
//                           <Image
//                             src={agent.imageUrl}
//                             alt={agent.name}
//                             className="w-full h-full object-cover"
//                             onError={(
//                               e: React.SyntheticEvent<HTMLImageElement>
//                             ) => {
//                               const target = e.target as HTMLImageElement;
//                               target.onerror = null;
//                               target.src = '/images/agent-default.png';
//                               // 如果默认图像也加载失败，则回退到显示首字母
//                               target.onerror = () => {
//                                 if (target.parentElement) {
//                                   target.style.display = 'none';
//                                   const fallbackEl =
//                                     target.parentElement.querySelector(
//                                       '.fallback-text'
//                                     );
//                                   if (fallbackEl) {
//                                     (fallbackEl as HTMLElement).style.display =
//                                       'flex';
//                                   }
//                                 }
//                               };
//                             }}
//                           />
//                         ) : (
//                           <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold fallback-text">
//                             {agent.name.charAt(0)}
//                           </div>
//                         )}
//                       </div>
//                       <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
//                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
//                           <div>
//                             <div className="flex items-center">
//                               <h3 className="text-lg font-semibold text-gray-900">
//                                 {agent.name}
//                               </h3>
//                               <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                                 {
//                                   categories.find(
//                                     (c) => c.id === agent.category
//                                   )?.name
//                                 }
//                               </span>
//                             </div>
//                             <div className="flex items-center mt-1">
//                               <StarFilledIcon className="h-4 w-4 text-yellow-400" />
//                               <span className="text-sm text-gray-700 ml-1">
//                                 {agent.rating}
//                               </span>
//                               <span className="text-xs text-gray-500 ml-1">
//                                 ({agent.reviews} {t.reviews})
//                               </span>
//                             </div>
//                           </div>
//                           <div className="mt-2 sm:mt-0 flex items-center">
//                             <span className="text-lg font-semibold text-gray-900">
//                               {agent.price} {t.pricePerUse}
//                             </span>
//                             <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                               {t.viewDetails}
//                             </button>
//                           </div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600">
//                           {agent.description}
//                         </p>
//                         <div className="mt-4">
//                           <div className="flex flex-wrap gap-2">
//                             {agent.tags.map((tag) => (
//                               <span
//                                 key={tag}
//                                 className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
//                               >
//                                 {tag}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="mt-4 border-t border-gray-200 pt-4">
//                           <h4 className="text-sm font-medium text-gray-900">
//                             {t.abilities}
//                           </h4>
//                           <div className="mt-2 flex flex-wrap gap-3">
//                             {agent.abilities.map((ability) => (
//                               <div
//                                 key={ability}
//                                 className="flex items-center text-sm text-gray-700"
//                               >
//                                 <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
//                                 {ability}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Upload Modal */}
//       <UploadAgentModal
//         isOpen={showUploadModal}
//         onClose={() => setShowUploadModal(false)}
//         onSubmit={handleAgentUpload}
//         categories={categories.filter((cat) => cat.id !== 'all')}
//         translations={{
//           walletAddress: 'Wallet Address',
//           uploadAgent: t.uploadAgent,
//           agentName: t.agentName || 'Agent Name',
//           category: t.category || 'Category',
//           selectCategory: t.selectCategory || 'Select Category',
//           description: t.description || 'Description',
//           price: t.price || 'Price',
//           pricePerUse: t.pricePerUse,
//           tags: t.tags || 'Tags',
//           commaSeparated: t.commaSeparated || 'Comma Separated',
//           abilities: t.abilities || 'Abilities',
//           upload: t.upload || 'Upload',
//           cancel: t.cancel || 'Cancel',
//         }}
//       />
//     </div>
//   );
// }
import ComingSoon from '@/components/Home/ComingSoon';
export default function DashboardPage() {
  return <ComingSoon />;
}
