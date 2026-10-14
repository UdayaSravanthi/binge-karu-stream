import {describe,it,expect} from 'vitest';
import {filterTitles,titles} from './catalog';
describe('catalog discovery',()=>{
 it('filters comedy titles',()=>{expect(filterTitles(titles,'Comedy','','Home','All languages',[]).map(t=>t.name)).toEqual(['Weekend Wale']);});
 it('finds title names without case sensitivity',()=>{expect(filterTitles(titles,'All','RAAT','Home','All languages',[]).map(t=>t.id)).toEqual([1]);});
 it('shows only selected watchlist titles',()=>{expect(filterTitles(titles,'All','','My List','All languages',[3,5]).map(t=>t.id)).toEqual([3,5]);});
});
