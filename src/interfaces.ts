export interface IGame {
  roles: IRole[];
  cards: ICard[];
}

export interface IRole {
  id: 1;
  name: "Mafia";
  description: "Устраняет игроков каждую ночь.";
  team: "мафия";
  abilities: ["устранить"];
  isActive: true;
}

export interface ICard {
  id: 4;
  roleId: 4;
  name: "Sheriff Card";
  description: "Назначает игроку роль шерифа.";
  src: ["src/assets/sheriff_card.png"];
}
