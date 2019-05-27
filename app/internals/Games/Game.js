import { LauncherModel } from "../..";
import {knexClient} from './../../index';
// @flow

export class Game{

  id: number | string;
  name: string;
  platform: Platform;
  nectar_id: string
  file_path: string;
  alternativePlatforms: Array<string>;
  launcher_model: Object;
  launcher_id: string | number | null;



  constructor(id: number, name: string, nectar_id: string, file_path: string, launcher_model: Object){
    this.id = id;
    this.name = name;
    this.nectar_id = nectar_id;
    this.file_path = file_path;
    this.launcher_model = launcher_model;
  }

  launch() {
    this.getLauncher().then((launcher_model) => {
      const { exec } = require('child_process');
      let launchcommand = "";
      if(launcher_model != null && launcher_model.attributes.name == "Steam" && this.launcher_id != null){
        launchcommand = `"${launcher_model.attributes.path_to_launcher}" -applaunch ${this.launcher_id} -no-browser`;
      }else{
        launchcommand = `"${launcher_model.attributes.path_to_launcher}" "${this.file_path}"`
      }
      exec(launchcommand, (err, stdout, stderr) => {
          if (err) {
          // node couldn't execute the command
          console.error("Could Not Execute Game ${this.name}")
          return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
          })
        }


  async getLauncher(){
    return knexClient.select('*')
  .from('launchers_games')
  .where({game_id: `${this.id}`}).then((rows) => {
    if(rows.length > 0){
      return LauncherModel.where({id: rows[0].launcher_id}).fetch().then((element) =>{
        if(element != null){
          return element
        }
      })
    }
  })
  }



  static ModelToGameFactory(game_model: Game){
    const g = new Game (
      game_model.get('id'),
      game_model.get('title'),
      game_model.get('nectar_id'),
      game_model.get('file_path'),
      game_model,
    )
    g.launcher_id = game_model.get('launcher_id')
    return g;
  }



}

export const platforms =  {
  "PlayStation 1": "PlayStation 1",
  "PlayStation 2": "PlayStation 2",
  "PlayStation 3": "PlayStation 3",
  "PlayStation 4": "PlayStation 4",
  "PS Vita": "PS Vita",
  "Xbox 360": "Xbox 360",
  "Xbox": "Xbox",
  "Xbox One": "Xbox One",
  "Playstation Portable": "Playstation Portable",
  "Wii": "Wii",
  "PC": "PC",
  "Wii U": "Wii U",
  "Nintendo Switch": "Nintendo Switch",
  'Mac OS': 'Mac OS',
  'Linux': 'Linux',
  'iOS': 'iOS',
  'Android': 'Android',
  'Nintendo 3DS': "Nintendo 3DS",
  "Nintendo DS": "Nintendo DS",
  "Nintendo DSi": "Nintendo DSi",
  'GameCube': 'GameCube',
  'Nintendo 64': 'Nintendo 64',
  "Game Boy Advance": 'Game Boy Advance',
  'Game Boy Color': "Game Boy Color",
  'Game Boy': 'Game Boy',
  'SNES': 'SNES',
  'NES': 'NES',
  'Original Macintosh':'Original Macintosh',
  'Apple': 'Apple',
  'Commodore/Amiga':'Commodore / Amiga',
  "Atari 7800": "Atari 7800",
  "Atari 5200":"Atari 5200",
  "Atari 2600":"Atari 2600",
  "Atari Flashback":"Atari Flashback",
  "Atari 8-bit":"Atari 8-bit",
  "Atari ST":"Atari ST",
  "Atari Lynx": "Atari Lynx",
  "Atari XEGS": "Atari XEGS",
  "Genesis": "Genesis",
  "SEGA Saturn": "SEGA Saturn",
  "SEGA CD": "SEGA CD",
  "SEGA 32X":"SEGA 32X",
  "SEGA Master System": "SEGA Master System",
  "Dreamcast": "Dreamcast",
  "3DO": "3DO",
  "Jaguar": "Jaguar",
  "Game Gear": "Game Gear",
  "Nat Geo": "Nat Geo",
  "Web": "Web"
}

export type Platform = $Keys<typeof platforms>;

