Sound effects made with earshot (https://github.com/Leonxlnx/earshot, MIT; sounds rendered by code, yours to use).
Regenerate with: earshot make "<words>" -o <name>.wav   (stamp: earshot make "rubber stamp" --sound stamp/press -o stamp.wav)

whoosh  "a soft cinematic whoosh transition"   -> whoosh/soft
impact  "a deep cinematic impact hit"          -> boom/deep
stamp   --sound stamp/press
tick    "a soft interface tick"                -> tick/soft
key     "a single keyboard key click"          -> keyboard/mechanical
riser   "a tense cinematic riser build-up"     -> rise/air
ding    "a bright notification ding"           -> notify/pair

Use in a reel: makeMetaReel({ ..., sfxDir: "sfx-earshot" })
