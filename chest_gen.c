char some_spawn_5_pre_update_variant_and_subtype(unsigned int seed,
                                                 int *pVariant, int *pSubtype,
                                                 int advanceRNG,
                                                 int something_about_keeper) {

  //.................
  switch (*pVariant) {
  case 55:
    if (!*pSubtype)
      *pSubtype = 1;
    break; // TODO: maybe other code after break

  case 50:
    if (*pSubtype != 0) {
      if (*pVariant == 52 && HasTrinket(151)) {
        *pVariant = 54;
      }
      break;
    } 
     
      if (0 == RandInt(0x28u)) {
        *pVariant = 54;
      } else if (0 == RandInt(0x14u)) {
        *pVariant = 360;
      } else if (0 == RandInt(0x32u)) {
        *pVariant = 51;
      } else if (0 == RandInt(0x50u)) {
        *pVariant = 52;
      } else if (0 == RandInt(0x64u)) {
        *pVariant = 69;
        *pSubtype = 1;
        if (0 == RandInt(0x64u) && (AchievementUnlocked[604])) {
          *pSubtype = 2;
        }
        break;
      } else if (!RandInt(0x50u) && AchievementUnlocked[609]) {
        *pVariant = 56;
      } else {
        if (!RandInt(0x28u)) {
          if (Room_GetRoomShape() != 2 && Room_GetRoomShape() != 3 &&
              Room_GetRoomShape() != 7 && Room_GetRoomShape() != 5 &&
              AchievementUnlocked[611]) {
            *pVariant = 58;
          }
        }
      }
    // case 60://TODO 眼瞎了，明天搞
      if (!RandInt(1600u)) {
        *pVariant = 53;
      }
    case 51:
    case 52:
    case 53:
    case 54:
    case 56:
    case 58:

      if (HasTrinket(61)) {
        *pVariant = 360;
      } else if (*pVariant == 52 && HasTrinket(151)) {
        *pVariant = 54;
      }

      
    case 57:
    case 360:
      if (*pSubtype) {
        break;
      }

      if (HasTrinket(159) && !HasTrinket(61) && *pVariant != 57) {
        *pVariant = 60;
      } else {
        if (*pVariant == 60 && RandInt(0x78u) == 0 &&
            AchievementUnlocked[601]) {
          *pVariant = 57;
        }
      }

      if (*pVariant == 57) {
        *pSubtype = RandInt(4u) + 1 + RandInt(4u);
      } else {
        if (*pVariant == 53) {
          *pSubtype = 2;
        } else {
          *pSubtype = 1;
        }
      }    
  }
  ///////////////..........
}