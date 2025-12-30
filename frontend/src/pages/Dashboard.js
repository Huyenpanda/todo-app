document.addEventListener("DOMContentLoaded", function () {
  // luu task vao localStorage

  
  function saveTasks() {
    try {
      localStorage.setItem('todoistTasks', JSON.stringify(tasks));
    } catch (e) {
      console.log('Cannot save to localStorage:', e);
    }
  }

  function loadTasks() {
    try {
      const saved = localStorage.getItem('todoistTasks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.log('Cannot load from localStorage:', e);
    }
    return getDefaultTasks();
  }

  function getDefaultTasks() {
    return [
      {
        id: 1,
        title: "Sample task today",
        desc: "This is a description",
        due_date: new Date().toISOString().split('T')[0],
        priority: "high",
        reminder: "",
        project: "Inbox",
        labels: ["urgent"],
        done: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: "Overdue task",
        desc: "",
        due_date: "2024-12-20",
        priority: "medium",
        reminder: "",
        project: "Inbox",
        labels: [],
        done: false,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: "Future task",
        desc: "Upcoming task description",
        due_date: "2025-12-27",
        priority: "",
        reminder: "",
        project: "Inbox",
        labels: [],
        done: false,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: "Completed task",
        desc: "This task is done",
        due_date: "",
        priority: "",
        reminder: "",
        project: "Getting Started",
        labels: [],
        done: true,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        title: "Getting Started task",
        desc: "Learn Todoist basics",
        due_date: new Date().toISOString().split('T')[0],
        priority: "low",
        reminder: "",
        project: "Getting Started",
        labels: [],
        done: false,
        created_at: new Date().toISOString()
      }
    ];
  }

  let tasks = loadTasks();

  //  COMPONENTS 

  function createTaskEntryForm(containerId, defaultProject = 'Inbox', defaultDate = null) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const template = document.getElementById('task-entry-template');
    const clone = template.content.cloneNode(true);
    
    const taskEntryBox = clone.querySelector('.task-entry-box');
    const titleInput = clone.querySelector('.task-title-input');
    const descInput = clone.querySelector('.task-desc-input');
    const dateInput = clone.querySelector('.task-date');
    const priorityInput = clone.querySelector('.task-priority');
    const dateBtn = clone.querySelector('.date-btn');
    const priorityBtn = clone.querySelector('.priority-btn');
    const cancelBtn = clone.querySelector('.cancel-task');
    const confirmBtn = clone.querySelector('.confirm-add-task');

    
    dateBtn.addEventListener('click', () => {
      if (dateInput.style.display === 'none') {
        dateInput.style.display = 'inline-block';
        if (!dateInput.value && defaultDate) {
          dateInput.value = defaultDate;
        }
      } else {
        dateInput.style.display = 'none';
      }
    });

   
    priorityBtn.addEventListener('click', () => {
      priorityInput.style.display = priorityInput.style.display === 'none' ? 'inline-block' : 'none';
    });

    cancelBtn.addEventListener('click', () => {
      hideForm();
    });

    confirmBtn.addEventListener('click', () => {
      submitTask();
    });

    
    titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitTask();
      }
    });

    function submitTask() {
      const taskData = {
        title: titleInput.value.trim(),
        desc: descInput.value.trim(),
        due_date: dateInput.value || (defaultDate || ''),
        priority: priorityInput.value,
        project: defaultProject,
        labels: []
      };

      if (taskData.title) {
        addTask(taskData);
        clearForm();
        hideForm();
      }
    }

    function clearForm() {
      titleInput.value = '';
      descInput.value = '';
      dateInput.value = '';
      priorityInput.value = '';
      dateInput.style.display = 'none';
      priorityInput.style.display = 'none';
    }

    function showForm() {
      taskEntryBox.style.display = 'block';
      titleInput.focus();
    }

    function hideForm() {
      taskEntryBox.style.display = 'none';
      clearForm();
    }

    container.appendChild(clone);
    
    return {
      show: showForm,
      hide: hideForm,
      element: taskEntryBox
    };
  }


  function createTaskItem(task, options = {}) {
    const template = document.getElementById('task-item-template');
    const clone = template.content.cloneNode(true);
    
    const taskItem = clone.querySelector('.task-item');
    const checkboxWrapper = clone.querySelector('.task-checkbox-wrapper');
    const checkbox = clone.querySelector('.task-checkbox');
    const checkboxLabel = clone.querySelector('.checkbox-label');
    const title = clone.querySelector('.task-title');
    const desc = clone.querySelector('.task-desc');
    const meta = clone.querySelector('.task-meta');
    const editBtn = clone.querySelector('.task-edit-btn');
    const moreBtn = clone.querySelector('.task-more-btn');

    
    checkbox.id = `task-${task.id}`;
    checkboxLabel.setAttribute('for', `task-${task.id}`);
    
    
    checkbox.checked = task.done;
    checkbox.dataset.id = task.id;
    title.textContent = task.title;
    
    if (task.done) {
      title.classList.add('done');
      taskItem.classList.add('completed');
    }

    if (task.desc) {
      desc.textContent = task.desc;
      desc.style.display = 'block';
    }

    editBtn.dataset.id = task.id;
    moreBtn.dataset.id = task.id;

    
    if (task.priority && !task.done) {
      checkboxWrapper.classList.add(`priority-${task.priority}`);
    }

    
    let metaHTML = '';
    if (task.due_date) {
      const isOverdue = options.isOverdue || false;
      const dateObj = new Date(task.due_date);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      metaHTML += `<span class="date-badge ${isOverdue ? 'overdue' : ''}">${dateStr}</span>`;
    }
    if (task.priority && !task.done) {
      const priorityIcons = {
        high: '<i class="fas fa-flag" style="color: #d1453b;"></i>',
        medium: '<i class="fas fa-flag" style="color: #eb8909;"></i>',
        low: '<i class="fas fa-flag" style="color: #4073ff;"></i>'
      };
      metaHTML += `<span class="priority-badge">${priorityIcons[task.priority]}</span>`;
    }
    if (task.project && task.project !== 'Inbox') {
      metaHTML += `<span class="project-tag"># ${task.project}</span>`;
    }
    if (task.labels && task.labels.length > 0) {
      task.labels.forEach(label => {
        metaHTML += `<span class="label-tag">@${label}</span>`;
      });
    }
    meta.innerHTML = metaHTML;

    return clone;
  }

  
  const menuItems = document.querySelectorAll(".menu-item");
  const sections = document.querySelectorAll("main > div");
  const addTaskBtn = document.querySelector(".add-task-btn");
  const emptyBox = document.querySelector(".Inbox .empty-box");
  const searchInput = document.querySelector(".search-input");
  const projectItem = document.querySelector(".project-item");

  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const taskForms = {
    inbox: createTaskEntryForm('task-entry-inbox', 'Inbox'),
    today: createTaskEntryForm('task-entry-today', 'Inbox', today),
    upcoming: createTaskEntryForm('task-entry-upcoming', 'Inbox', tomorrowStr),
    gettingStarted: createTaskEntryForm('task-entry-getting-started', 'Getting Started')
  };

  
  function addTask(taskData) {
    const task = {
      id: Date.now(),
      title: taskData.title,
      desc: taskData.desc || '',
      due_date: taskData.due_date || '',
      priority: taskData.priority || '',
      reminder: '',
      project: taskData.project || 'Inbox',
      labels: taskData.labels || [],
      done: false,
      created_at: new Date().toISOString()
    };
    tasks.push(task);
    saveTasks();
    renderAllSections();
    updateProjectCount();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderAllSections();
    updateProjectCount();
  }

  function toggleTaskDone(id, isDone) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.done = isDone;
      saveTasks();
      renderAllSections();
      updateProjectCount();
    }
  }

  function updateProjectCount() {
    const gettingStartedCount = tasks.filter(t => t.project === 'Getting Started').length;
    const countEl = document.querySelector('.project-item .count');
    if (countEl) {
      countEl.textContent = gettingStartedCount;
    }
  }

  
  
  function renderAllSections() {
    const search = searchInput.value.toLowerCase();
    renderInbox(search);
    renderToday(search);
    renderUpcoming(search);
    renderGettingStarted(search);
  }

  function renderInbox(search = '') {
    const inboxList = document.getElementById('inbox-task-list');
    if (!inboxList) return;
    
    inboxList.innerHTML = '';
    let inboxTasks = tasks.filter(task => task.project === 'Inbox' && !task.done);
    
    if (search) {
      inboxTasks = inboxTasks.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.desc.toLowerCase().includes(search)
      );
    }

    if (inboxTasks.length === 0 && !search) {
      emptyBox.style.display = 'block';
    } else {
      emptyBox.style.display = 'none';
      inboxTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        inboxList.appendChild(taskItem);
      });
    }
  }

  function renderToday(search = '') {
    const todayList = document.getElementById('today-task-list');
    if (!todayList) return;
    
    todayList.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];
    let overdueTasks = tasks.filter(task => task.due_date && task.due_date < today && !task.done);
    let todayTasks = tasks.filter(task => task.due_date === today && !task.done);

    if (search) {
      overdueTasks = overdueTasks.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.desc.toLowerCase().includes(search)
      );
      todayTasks = todayTasks.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.desc.toLowerCase().includes(search)
      );
    }

    // Render overdue
    if (overdueTasks.length > 0) {
      const overdueTitle = document.createElement('h3');
      overdueTitle.className = 'section-subtitle';
      overdueTitle.textContent = 'Overdue';
      todayList.appendChild(overdueTitle);
      
      overdueTasks.forEach(task => {
        const taskItem = createTaskItem(task, { isOverdue: true });
        todayList.appendChild(taskItem);
      });
    }

    // Render today
    if (todayTasks.length > 0) {
      const todayTitle = document.createElement('h3');
      todayTitle.className = 'section-subtitle';
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
      todayTitle.textContent = `${dateStr} · Today · ${dayStr}`;
      todayList.appendChild(todayTitle);
      
      todayTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        todayList.appendChild(taskItem);
      });
    }

    // Update count
    const todayCount = document.querySelector('.today-count');
    if (todayCount) {
      todayCount.textContent = overdueTasks.length + todayTasks.length;
    }
  }

  function renderUpcoming(search = '') {
    const upcomingList = document.getElementById('upcoming-task-list');
    if (!upcomingList) return;
    
    upcomingList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];
    let upcomingTasks = tasks.filter(task => task.due_date && task.due_date > today && !task.done);
    
    if (search) {
      upcomingTasks = upcomingTasks.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.desc.toLowerCase().includes(search)
      );
    }

    // Group by date
    const grouped = {};
    upcomingTasks.forEach(task => {
      if (!grouped[task.due_date]) {
        grouped[task.due_date] = [];
      }
      grouped[task.due_date].push(task);
    });

    // Render by date
    Object.keys(grouped).sort().forEach(date => {
      const dateTitle = document.createElement('h3');
      dateTitle.className = 'section-subtitle';
      const dateObj = new Date(date);
      const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      dateTitle.textContent = `${dateStr} · ${dayStr}`;
      upcomingList.appendChild(dateTitle);

      grouped[date].forEach(task => {
        const taskItem = createTaskItem(task);
        upcomingList.appendChild(taskItem);
      });
    });
  }

  function renderGettingStarted(search = '') {
    const gettingStartedList = document.getElementById('getting-started-task-list');
    if (!gettingStartedList) return;
    
    gettingStartedList.innerHTML = '';
    let projectTasks = tasks.filter(task => task.project === 'Getting Started');
    
    if (search) {
      projectTasks = projectTasks.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.desc.toLowerCase().includes(search)
      );
    }

    // Separate completed and incomplete
    const incompleteTasks = projectTasks.filter(t => !t.done);
    const completedTasks = projectTasks.filter(t => t.done);

    // Render incomplete tasks
    incompleteTasks.forEach(task => {
      const taskItem = createTaskItem(task);
      gettingStartedList.appendChild(taskItem);
    });

    // Render completed tasks section
    if (completedTasks.length > 0) {
      const completedTitle = document.createElement('h3');
      completedTitle.className = 'section-subtitle completed-section-title';
      completedTitle.innerHTML = `<i class="fas fa-check-circle"></i> Completed (${completedTasks.length})`;
      gettingStartedList.appendChild(completedTitle);

      completedTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        gettingStartedList.appendChild(taskItem);
      });
    }
  }

  // ============ EVENT LISTENERS ============
  
  // Tab navigation
  menuItems.forEach(item => {
    item.addEventListener("click", function () {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      let sectionName = item.textContent.trim().replace("&", "").replace("#", "").split(" ")[0];
      
      // Handle Getting Started project
      if (item.classList.contains('project-item')) {
        sectionName = 'GettingStarted';
      }

      sections.forEach(section => section.style.display = "none");

      const targetSection = document.querySelector(`.${sectionName}`);
      if (targetSection) {
        targetSection.style.display = "block";
      }
    });
  });

  // Sidebar add task button
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function () {
      menuItems.forEach(i => i.classList.remove("active"));
      menuItems[1].classList.add("active");
      sections.forEach(section => section.style.display = "none");
      document.querySelector(".Inbox").style.display = "block";

      if (taskForms.inbox) {
        taskForms.inbox.show();
      }
    });
  }

  // Add task buttons at bottom of each section
  document.querySelectorAll('.add-task-inline-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      if (section === 'inbox' && taskForms.inbox) {
        taskForms.inbox.show();
      } else if (section === 'today' && taskForms.today) {
        taskForms.today.show();
      } else if (section === 'upcoming' && taskForms.upcoming) {
        taskForms.upcoming.show();
      } else if (section === 'getting-started' && taskForms.gettingStarted) {
        taskForms.gettingStarted.show();
      }
    });
  });

  // Event delegation for task actions
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('task-checkbox')) {
      const id = parseInt(e.target.dataset.id);
      const taskItem = e.target.closest('.task-item');
      
      if (e.target.checked) {
        // Add fade out animation
        taskItem.style.opacity = '0.5';
        taskItem.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          toggleTaskDone(id, true);
        }, 300);
      } else {
        toggleTaskDone(id, false);
      }
    }
  });

  document.addEventListener('click', function(e) {
    // More button - show delete option
    if (e.target.classList.contains('task-more-btn') || e.target.closest('.task-more-btn')) {
      const btn = e.target.classList.contains('task-more-btn') ? e.target : e.target.closest('.task-more-btn');
      const id = parseInt(btn.dataset.id);
      if (confirm('Delete this task?')) {
        deleteTask(id);
      }
    }

    // nút sửa task
    if (e.target.classList.contains('task-edit-btn') || e.target.closest('.task-edit-btn')) {
      const btn = e.target.classList.contains('task-edit-btn') ? e.target : e.target.closest('.task-edit-btn');
      const id = parseInt(btn.dataset.id);
      
      console.log('Edit task:', id);
    }
  });

  
  searchInput.addEventListener('input', function() {
    renderAllSections();
  });

  
  renderAllSections();
  updateProjectCount();
});