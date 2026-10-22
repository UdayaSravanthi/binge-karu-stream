import p1 from '@/assets/poster_1.jpg';
import p2 from '@/assets/poster_2.jpg';
import p3 from '@/assets/poster_3.jpg';
import p4 from '@/assets/poster_4.jpg';
import p5 from '@/assets/poster_5.jpg';
import p6 from '@/assets/poster_6.jpg';
import hero from '@/assets/city_evening.jpg';
export type Title = { id:number; slug:string; name:string; genre:string; language:string; type:string; image:string; duration:string; description:string; badge?:string };
export const titles:Title[] = [
 {id:1,slug:'raat-baaki',name:'Raat Baaki',genre:'Thriller',language:'Hindi',type:'Movies',image:p1,duration:'2h 08m',badge:'NEW RELEASE',description:'A detective follows a missing person into the shadows of a city that never sleeps.'},
 {id:2,slug:'weekend-wale',name:'Weekend Wale',genre:'Comedy',language:'Hindi',type:'Series',image:p2,duration:'8 episodes',description:'Three friends leave their deadlines behind for a road trip with no plan and plenty of surprises.'},
 {id:3,slug:'ek-nayi-subah',name:'Ek Nayi Subah',genre:'Drama',language:'Hindi',type:'Series',image:p3,duration:'12 episodes',badge:'BINGEKARO ORIGINAL',description:'A woman puts herself first for the first time, discovering that it is never too late to begin again.'},
 {id:4,slug:'after-hours',name:'After Hours',genre:'Romance',language:'English',type:'Series',image:p4,duration:'6 episodes',description:'When the office lights go out, two colleagues discover a connection beyond the daily grind.'},
 {id:5,slug:'raasta',name:'Raasta',genre:'Action',language:'Telugu',type:'Movies',image:p5,duration:'2h 15m',description:'One journey through the mountains. One promise that cannot be broken.'},
 {id:6,slug:'ghar-ki-baat',name:'Ghar Ki Baat',genre:'Drama',language:'Hindi',type:'Series',image:p6,duration:'10 episodes',description:'A family finds that the biggest stories often unfold around the smallest kitchen table.'},
];
export const featured:Title = {id:7,slug:'ek-shaam-aur',name:'Ek Shaam Aur',genre:'Romance',language:'Hindi',type:'Series',image:hero,duration:'8 episodes',description:'Two strangers. One city. A connection neither saw coming. Some stories begin when the day ends.'};
/** Every title with its own page, featured first. */
export const allTitles:Title[] = [featured, ...titles];
export function titleBySlug(slug:string):Title|undefined { return allTitles.find(t=>t.slug===slug); }
export function typeLabel(t:Title):'Movie'|'Series' { return t.type==='Series'?'Series':'Movie'; }
export const posterAlt = (t: Title) =>
  `${t.name}, ${t.language} ${t.genre.toLowerCase()} ${typeLabel(t).toLowerCase()} poster`;
export const LANGUAGE_CODES:Record<string,string> = {Hindi:'hi',English:'en',Telugu:'te'};
export function filterTitles(items:Title[],genre:string,query:string,view:string,language:string,saved:number[]) {
 return items.filter(t => (genre==='All'||t.genre===genre) && (!query||`${t.name} ${t.genre}`.toLowerCase().includes(query.toLowerCase())) && (view==='Home'||(view==='My List'?saved.includes(t.id):view==='Originals'?Boolean(t.badge?.includes('ORIGINAL')):t.type===view)) && (language==='All languages'||t.language===language));
}
