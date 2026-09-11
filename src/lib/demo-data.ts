// ─── Demo Data ───
// Used when Supabase is not configured. Replace with real data or connect Supabase.

import { Memory, SpecialDate, Letter, SiteSettings } from './types';

export const demoSettings: SiteSettings = {
  partner1_name: 'Shubhajit',
  partner2_name: 'Bubu',
  relationship_start: '2026-07-19',
  birthday: '2026-09-12',
  birthday_name: 'Bubu',
  birthday_message: 'Every moment with you is a gift I never knew I needed. You make the ordinary feel magical. Happy Birthday, my love. Here\'s to us — today, tomorrow, and always. ♥',
  passcode: 'ourstory',
};

export const demoMemories: Memory[] = [
  {
    id: '1',
    title: 'The Beginning',
    memory_date: '2026-07-19',
    caption: 'It started with a call. Before we became us, we were two people who loved roasting each other.',
    photo_urls: [],
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: '2',
    title: 'Our First Date',
    memory_date: '2026-08-09',
    caption: 'A deal, three consecutive 8 Ball Pool wins, and a Spider-Man movie. Somehow, a silly challenge became our first date.',
    photo_urls: [],
    created_at: '2026-08-09T00:00:00Z',
  },
  {
    id: '3',
    title: 'The Goodbye',
    memory_date: '2026-08-17',
    caption: 'Another movie, some quiet time together, and a goodbye that felt harder than it should have. Somewhere in that moment, I realized I was falling for her even deeper.',
    photo_urls: [],
    created_at: '2026-08-17T00:00:00Z',
  },
  {
    id: '4',
    title: 'The Best Day',
    memory_date: '2026-08-29',
    caption: 'The best day of my life. A day that brought us closer than ever and gave us memories and first experiences I\'ll never forget.',
    photo_urls: [],
    created_at: '2026-08-29T00:00:00Z',
  },
];

export const demoSpecialDates: SpecialDate[] = [
  {
    id: '1',
    date: '2026-07-19',
    label: 'The Beginning',
    linked_memory_id: '1',
    recurring: true,
  },
  {
    id: '2',
    date: '2026-08-09',
    label: 'Our First Date',
    linked_memory_id: '2',
    recurring: true,
  },
  {
    id: '3',
    date: '2026-08-17',
    label: 'The Goodbye',
    linked_memory_id: '3',
    recurring: true,
  },
  {
    id: '4',
    date: '2026-08-29',
    label: 'The Best Day',
    linked_memory_id: '4',
    recurring: true,
  },
  {
    id: '5',
    date: '2026-09-12',
    label: 'Bubu\'s Birthday',
    linked_memory_id: null,
    recurring: true,
  },
];

export const demoLetters: Letter[] = [
  {
    id: '1',
    title: '1 MONTH ALREADY... !!!',
    content: 'Bubuuuuu.... ami ajke khub khub khubbbbb happieee...\nLike seriously dekte dekte 1 month hoagelo... ♥️ Amar\nliterally kanna pacche likhte gia.... "Tmr moton\nkauke life a pabo r je amk atoooo bhalobashbeee" 💕\nJei cheleta k ami akhon atoooo bhalobashi take ami\nkokhono school e dekhlam e naaaahhh!! R jekhane\namra Same School e porechi ata believe e korte\nparinaa... "But akhon jokhon peyegachi tmk rrrrr\nCharbonaaaaaahh" ♥️ [THREAT DILAM] Bubbbbuuuuuu...\n"I LOVE YOU" khuubbbb... "Amader first Date 09.08.2026"\nkonodinoooo bhulbo Naaa r "amader first kissieee o"\nKhubbb special moments amr jonno "Tmr sob\nkichuiii amr jonno khub special Shonaaa" ♥️ Jani aktu\nbeshi raag kore feli but toke bhalobashhii khubbb r\nataooo jani "Tumio bhalobasho khub" [Arom bhabei\nbhalabeshe jashh shona] "aailobheuuu so much Shona"\nThank you for making me feel special with each\npassing day... Thank you for everything you do\nfor meee!! You make me feel like the mosstttt\nspecial personn in the world bubuuu sottieeeee 💕\nTmr moton keo kokhono amk ato jotno r ador kore\nbhalobasheni... Aailobheu shona once again "Happy 1 month"\nmuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaahhhhh',
    letter_date: '2026-08-19',
    created_at: '2026-08-19T00:00:00Z',
  },
  {
    id: '2',
    title: 'To - My Dadu.. 💕',
    content: 'Subject - Lovey doveyyy and missie missieee talksssszzz...\n\nRespected Dadu...,\n\nI, Diya Ghosh resident of (your Dil). I am writing\nthis letter to express all of my feelings to youuuuu...\nSoooo... basically ata amar first letter tmk... ami\nlike khub khub khubbbbb excited bubuuuuu 💕 I literally\nnever planned to feel like this wayyyy, but somewhere\nbetween our conversations, you became my favourite\npart of each and everyday... 🥺♥️ I feel safe around\nuuu my love... 💕 R bubuuu listen !!! Tmk chara\nKotthaoooo jabona baibyyy (muaaaaaaaaaaaaaaahhhhh) 🥺\nAmk nia akdm bhabbe naaa... tumi career a focus koro\nporashona koro... I\'ll support you shunu ♥️... (9th August\n2026) amader first dekha hocche... ami khubbbbbb\nexcited abr nervous o but thikacheeyyyyy... tumi\njkhn ae letter ta porbe tokhon amra diyane bari chole\nashbooo... 👀♥️ beshiii pakamo korte gia emoji gulo nosto\nhoagelooo but anyways "I LOVE YOU BUBU" aailobheuu\nso muchhh... plzz tumi abar kokhono amk chere jeonaaa...!!\n\nFrom - Your Dadi... 💕',
    letter_date: '2026-08-09',
    created_at: '2026-08-09T00:00:00Z',
  }
];
