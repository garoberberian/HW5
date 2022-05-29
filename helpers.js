exports.shouldRemind = task => {
    return (
      task.dueDateParsed - Date.now() < 120000 &&
      task.dueDateParsed - Date.now() > 0 &&
      !task.reminded &&
      !task.completed
    );
  };
