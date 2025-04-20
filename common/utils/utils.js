import { Types } from 'mongoose';

class Utils {
  static objectId = Types.ObjectId;

  static PORT = process.env.PORT || 4400;

  static SECRET =
    process.env.SECRET ||
    "^localhost/([0-9]+)/([_0-9a-z-]+)@Groupe38/@côdeW@arrior";
}

export default Utils;
