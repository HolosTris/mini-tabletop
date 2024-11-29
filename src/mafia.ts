const gameData = {
    roles: [
      {
        id: 1,
        name: "Mafia",
        description: "Устраняет игроков каждую ночь.",
        team: "мафия",
        abilities: ["устранить"],
        isActive: true
      },
      {
        id: 2,
        name: "Doctor",
        description: "Может защищать игрока каждую ночь.",
        team: "гражданские лица",
        abilities: ["защищать"],
        isActive: true
      },
      {
        id: 3,
        name: "Sheriff",
        description: "Может проверять роль игрока каждую ночь.",
        team: "гражданские лица",
        abilities: ["исследовать"],
        isActive: true
      },
      {
        id: 4,
        name: "Civilian",
        description: "Никаких особых способностей; цель - выжить и победить мафию.",
        team: "гражданские лица",
        abilities: [],
        isActive: true
      },
      {
        id: 5,
        name: "Don",
        description: "Возглавляет команду мафиози и может вычислить шерифа.",
        team: "мафия",
        abilities: ["Обнаруживает Шерифа"],
        isActive: true
      },
      {
        id: 6,
        name: "Maniac",
        description: "Уничтожает одного игрока каждую ночь, действуя независимо.",
        team: "нейтральный",
        abilities: ["устранить"],
        isActive: true
      },
      {
        id: 7,
        name: "Sergeant",
        description: "Помогает шерифу, также расследуя действия игроков.",
        team: "гражданские лица",
        abilities: ["исследовать"],
        isActive: true
      },
      {
        id: 8,
        name: "Lover",
        description: "Выбирает партнера; если он умирает, то же самое происходит и с Любовником.",
        team: "нейтральный",
        abilities: ["Выберите партнера"],
        isActive: true
      },
      {
        id: 9,
        name: "Lawyer",
        description: "Может защитить игрока от выбывания из игры один раз за игру.",
        team: "мафия",
        abilities: ["Защита от голосования"],
        isActive: true
      },
      {
        id: 10,
        name: "Suicidal",
        description: "Выигрывает, если они будут исключены в результате голосования.",
        team: "нейтральный",
        abilities: ["Ограничение потребления вина"],
        isActive: true
      }
    ],
    cards: [
      {
        id: 1,
        roleId: 1,
        name: "Mafia Card",
        description: "Назначает игроку роль мафиози."
      },
      {
        id: 2,
        roleId: 2,
        name: "Doctor Card",
        description: "Назначает игроку роль Врача."
      },
      {
        id: 3,
        roleId: 3,
        name: "Sheriff Card",
        description: "Назначает игроку роль шерифа."
      },
      {
        id: 4,
        roleId: 4,
        name: "Civilian Card",
        description: "Назначает игроку роль гражданского лица."
      },
      {
        id: 5,
        roleId: 5,
        name: "Don Card",
        description: "Назначает игроку роль Дона."
      },
      {
        id: 6,
        roleId: 6,
        name: "Maniac Card",
        description: "Назначает игроку роль Маньяка."
      },
      {
        id: 7,
        roleId: 7,
        name: "Sergeant Card",
        description: "Назначает игроку роль сержанта."
      },
      {
        id: 8,
        roleId: 8,
        name: "Lover Card",
        description: "Назначает игроку роль Любовника."
      },
      {
        id: 9,
        roleId: 9,
        name: "Lawyer Card",
        description: "Назначает игроку роль адвоката."
      },
      {
        id: 10,
        roleId: 10,
        name: "Suicidal Card",
        description: "Назначает игроку роль самоубийцы."
      }
    ]
  };
 
  
  // Функция для начала голосования
function startVoting(players) {
  players.forEach(player => {
    if (player.isActive && player.canVote) {
      bot.sendMessage(player.id, "Выберите игрока для голосования:", {
        reply_markup: {
          inline_keyboard: players
            .filter(p => p.isActive && p.id !== player.id)
            .map(p => [{
              text: p.name,
              callback_data: `vote_${p.id}`
            }])
        }
      });
    }
  });
}


// Функция для обработки голосов
bot.on('callback_query', query => {
  const playerId = query.from.id;
  const votedPlayerId = query.data.split('_')[1];

  if (!gameData.votes[playerId]) { // Игрок может голосовать только один раз
    gameData.votes[playerId] = votedPlayerId;
    bot.answerCallbackQuery(query.id, { text: "Ваш голос учтён!" });
  } else {
    bot.answerCallbackQuery(query.id, { text: "Вы уже проголосовали!" });
  }
});


// Подсчёт голосов и определение результата
function countVotes() {
  const voteCount = {};


  // Считаем количество голосов за каждого игрока
  Object.values(gameData.votes).forEach(votedId => {
    voteCount[votedId] = (voteCount[votedId] || 0) + 1;
  });


  // Находим игрока с максимальным количеством голосов
  let maxVotes = 0;
  let playerToEliminate = null;


  for (const playerId in voteCount) {
    if (voteCount[playerId] > maxVotes) {
      maxVotes = voteCount[playerId];
      playerToEliminate = playerId;
    }
  }


  // Удаляем игрока с наибольшим количеством голосов
  if (playerToEliminate) {
    eliminatePlayer(playerToEliminate);
  }


  // Сбрасываем голосование для следующего раунда
  gameData.votes = {};
}


function eliminatePlayer(playerId) {
  bot.sendMessage(playerId, "Вы были изгнаны из игры!");
  const player = gameData.roles.find(role => role.id === parseInt(playerId));
  if (player) player.isActive = false; // Отключаем игрока из активной игры
}


// Запуск голосования с таймером завершения
setTimeout(() => {
  countVotes();
}, 60000); // Голосование длится 60 секунд


