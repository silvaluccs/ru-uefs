<div align="center">

<img src="frontend/public/icon.png" alt="RU UEFS Logo" width="80" />

# 🍽️ RU UEFS

**Cardápio digital do Restaurante Universitário da UEFS**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

> Projeto independente e não oficial. Consulte o cardápio do RU da UEFS de forma rápida, organizada e com status em tempo real do restaurante.

</div>

---

## ✨ Funcionalidades

- 📅 **Cardápio do dia** — visualize as refeições de hoje separadas por café da manhã, almoço e jantar
- 🗓️ **Cardápio semanal** — veja toda a semana de uma vez em layout responsivo
- 🟢 **Status em tempo real** — badge dinâmico indica se o RU está aberto, fechado, servindo ou qual foi a última refeição
- 🌿 **Opção vegetariana** — destaque visual para opções ovolactovegetarianas
- 🤖 **Scraper automático** — extração semanal do cardápio via PDF com IA (Gemini)
- 📱 **Design responsivo** — experiência otimizada para mobile e desktop

---

## 🗂️ Estrutura do Projeto

```
ru-uefs/
├── 🖥️  frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/         # Home (hoje) e Weekly (semanal)
│       ├── features/menu/ # Componentes e hooks de cardápio
│       ├── components/    # UI reutilizável (Card, Skeleton, etc.)
│       ├── services/      # Integração com a API
│       └── types/         # Tipagens TypeScript
│
├── ⚙️  backend/           # FastAPI + MongoDB
│   ├── api/               # Rotas REST
│   ├── services/          # Lógica de negócio e horários
│   ├── schemas/           # Modelos Pydantic
│   └── config/            # Conexão com banco de dados
│
├── 🕷️  scraper/           # Pipeline de extração do cardápio
│   ├── download.py        # Download do PDF da UEFS
│   ├── extract.py         # Extração de texto/imagens do PDF
│   └── process_menu.py    # Processamento com Gemini AI → MongoDB
│
├── 🧪  tests/             # Testes do scraper
├── 🐳  docker-compose.yml # MongoDB local
└── 🔄  .github/workflows/ # CI: scraper roda toda segunda às 09h
```

---

## 🛠️ Stack

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev/) | 19 | Interface de usuário |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Tipagem estática |
| [Vite](https://vitejs.dev/) | 8 | Bundler e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização |
| [TanStack Query](https://tanstack.com/query) | 5 | Cache e fetching de dados |
| [React Router](https://reactrouter.com/) | 7 | Roteamento SPA |
| [Lucide React](https://lucide.dev/) | 1.16 | Ícones |
| [Axios](https://axios-http.com/) | 1.16 | Cliente HTTP |

### Backend
| Tecnologia | Uso |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | API REST assíncrona |
| [MongoDB](https://www.mongodb.com/) | Banco de dados |
| [PyMongo (async)](https://motor.readthedocs.io/) | Driver assíncrono |
| [Pydantic](https://docs.pydantic.dev/) | Validação de dados |
| [Uvicorn](https://www.uvicorn.org/) | Servidor ASGI |

### Scraper / Automação
| Tecnologia | Uso |
|---|---|
| [Google Gemini AI](https://ai.google.dev/) | Extração inteligente do cardápio do PDF |
| [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) | Parsing HTML |
| [GitHub Actions](https://github.com/features/actions) | Cron job toda segunda-feira às 09h |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.11+
- [Docker](https://www.docker.com/) (para o MongoDB)

### 1. Clone o repositório

```bash
git clone https://github.com/silvaluccs/ru-uefs.git
cd ru-uefs
```

### 2. Suba o banco de dados

```bash
docker-compose up -d
```

### 3. Configure as variáveis de ambiente

Crie um `.env` na raiz do projeto:

```env
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=senha
MONGO_INITDB_DATABASE=ru_uefs
MONGO_PORT=27017
MONGO_URI=mongodb://admin:senha@localhost:27017/ru_uefs?authSource=admin
GEMINI_API_KEY=sua_chave_aqui
```

### 4. Instale as dependências e rode o backend

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

O backend estará disponível em `http://localhost:8000`.

### 5. Rode o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## 📡 API

Base URL: `/api/v1/menu`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/today` | Cardápio do dia atual |
| `GET` | `/week` | Cardápio da semana vigente |
| `GET` | `/now` | Refeição sendo servida no momento |
| `GET` | `/{date}` | Cardápio de uma data específica (`DD-MM-YYYY`) |

Documentação interativa disponível em `http://localhost:8000/docs` (Swagger UI).

---

## 🔄 Scraper Automático

O cardápio é extraído automaticamente toda **segunda-feira às 09h (UTC)** via GitHub Actions:

1. **Download** — baixa o PDF do cardápio semanal da UEFS
2. **Extração** — lê e converte o conteúdo do PDF
3. **Processamento** — envia para o Gemini AI, que estrutura os dados em JSON
4. **Persistência** — salva o cardápio no MongoDB

Para rodar manualmente:

```bash
PYTHONPATH=. python scraper/process_menu.py
```

---

## 🏛️ Rotas da aplicação

| Rota | Página |
|---|---|
| `/hoje` | Cardápio do dia com status do RU em tempo real |
| `/semanal` | Cardápio completo da semana |

---

## ⚠️ Aviso

Este é um projeto **independente e não oficial**. Não possui vínculo com a administração da UEFS. O cardápio exibido está sujeito a alterações pela instituição sem aviso prévio.

---

## 👨‍💻 Autor

Desenvolvido por **Lucas Silva**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-silvaluccs-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/silvaluccs)
[![GitHub](https://img.shields.io/badge/GitHub-silvaluccs-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/silvaluccs)
