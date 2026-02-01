
import { Language } from './types';

export const translations: Record<Language, any> = {
  uz: {
    appName: "Kunlik Hisobot",
    nav: { home: "Asosiy", plan: "Reja", ai: "AI", history: "Arxiv" },
    dashboard: {
      productivity: "Bugungi mahsuldorlik",
      yesterdayPlans: "KECHAGI REJALAR",
      unfinished: "ta bajarilmagan",
      transfer: "KO'CHIRISH",
      sendReport: "HISOBOTNI YUBORISH",
      todayList: "Bugungi ro'yxat",
      noTasks: "Vazifalar belgilanmagan",
      reportTitle: "KUNLIK HISOBOT",
      result: "Natija",
      done: "Bajarildi",
      remains: "Qoldi",
      tasks: "Vazifalar"
    },
    planner: {
      addNew: "Yangi vazifa qo'shish",
      taskText: "Vazifa matni",
      placeholder: "Masalan: Hisobotni topshirish...",
      date: "Sana",
      time: "Vaqt (taxminan)",
      timePlaceholder: "30m, 1h...",
      mainGoal: "Asosiy maqsad",
      save: "Vazifani Saqlash",
      today: "Bugungi",
      noTasks: "Hozircha vazifalar yo'q"
    },
    assistant: {
      weeklyResult: "Haftalik natija",
      chatTitle: "AI Murabbiy",
      chatPlaceholder: "Savol bering...",
      recommendations: "Tavsiyalar",
      loading: "Yuklanmoqda...",
      thinking: "O'ylamoqda..."
    },
    history: {
      title: "Arxiv",
      days: "kun",
      noHistory: "Hali tarix mavjud emas"
    }
  },
  ru: {
    appName: "Дневной Отчет",
    nav: { home: "Главная", plan: "План", ai: "ИИ", history: "Архив" },
    dashboard: {
      productivity: "Продуктивность за сегодня",
      yesterdayPlans: "ВЧЕРАШНИЕ ПЛАНЫ",
      unfinished: "не выполнено",
      transfer: "ПЕРЕНЕСТИ",
      sendReport: "ОТПРАВИТЬ ОТЧЕТ",
      todayList: "Список на сегодня",
      noTasks: "Задачи не назначены",
      reportTitle: "ЕЖЕДНЕВНЫЙ ОТЧЕТ",
      result: "Результат",
      done: "Выполнено",
      remains: "Осталось",
      tasks: "Задачи"
    },
    planner: {
      addNew: "Добавить новую задачу",
      taskText: "Текст задачи",
      placeholder: "Например: Сдать отчет...",
      date: "Дата",
      time: "Время (примерно)",
      timePlaceholder: "30м, 1ч...",
      mainGoal: "Главная цель",
      save: "Сохранить задачу",
      today: "Сегодняшние",
      noTasks: "Задач пока нет"
    },
    assistant: {
      weeklyResult: "Результаты за неделю",
      chatTitle: "ИИ Тренер",
      chatPlaceholder: "Задайте вопрос...",
      recommendations: "Рекомендации",
      loading: "Загрузка...",
      thinking: "Думает..."
    },
    history: {
      title: "Архив",
      days: "дн.",
      noHistory: "История пока пуста"
    }
  },
  en: {
    appName: "Daily Report",
    nav: { home: "Home", plan: "Plan", ai: "AI", history: "History" },
    dashboard: {
      productivity: "Today's Productivity",
      yesterdayPlans: "YESTERDAY'S PLANS",
      unfinished: "unfinished",
      transfer: "TRANSFER",
      sendReport: "SEND REPORT",
      todayList: "Today's List",
      noTasks: "No tasks set",
      reportTitle: "DAILY REPORT",
      result: "Result",
      done: "Done",
      remains: "Left",
      tasks: "Tasks"
    },
    planner: {
      addNew: "Add New Task",
      taskText: "Task Description",
      placeholder: "Example: Submit report...",
      date: "Date",
      time: "Time (est.)",
      timePlaceholder: "30m, 1h...",
      mainGoal: "Main Goal",
      save: "Save Task",
      today: "Today's",
      noTasks: "No tasks yet"
    },
    assistant: {
      weeklyResult: "Weekly Results",
      chatTitle: "AI Coach",
      chatPlaceholder: "Ask a question...",
      recommendations: "Recommendations",
      loading: "Loading...",
      thinking: "Thinking..."
    },
    history: {
      title: "Archive",
      days: "days",
      noHistory: "No history yet"
    }
  }
};
