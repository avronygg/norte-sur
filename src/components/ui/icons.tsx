"use client";

/**
 * Íconos del sitio — Phosphor en peso "fill" (rellenos), re-exportados con
 * los mismos nombres que se usaban antes para no tocar el JSX.
 * Importar SIEMPRE desde "@/components/ui/icons".
 */

import {
  ArrowRight as PhArrowRight,
  ArrowLeft as PhArrowLeft,
  FileText as PhFileText,
  ShoppingCart as PhShoppingCart,
  Sparkle as PhSparkle,
  SquaresFour as PhSquaresFour,
  Lock as PhLock,
  Database as PhDatabase,
  Key as PhKey,
  List as PhList,
  X as PhX,
  Minus as PhMinus,
  Plus as PhPlus,
  Trash as PhTrash,
  Truck as PhTruck,
  ShieldCheck as PhShieldCheck,
  Package as PhPackage,
  CheckCircle as PhCheckCircle,
  CircleNotch as PhCircleNotch,
  MapPin as PhMapPin,
  Phone as PhPhone,
  Envelope as PhEnvelope,
  WhatsappLogo as PhWhatsappLogo,
  ArrowSquareOut as PhArrowSquareOut,
  Factory as PhFactory,
  Recycle as PhRecycle,
  Target as PhTarget,
  Medal as PhMedal,
  Clock as PhClock,
  CaretLeft as PhCaretLeft,
  CaretRight as PhCaretRight,
  Check as PhCheck,
  PlayCircle as PhPlayCircle,
  Buildings as PhBuildings,
  CaretDown as PhCaretDown,
  Funnel as PhFunnel,
  Gear as PhGear,
  House as PhHouse,
  SignOut as PhSignOut,
  PencilSimple as PhPencilSimple,
  Image as PhImage,
  Star as PhStar,
  Eye as PhEye,
  UploadSimple as PhUploadSimple,
  Tag as PhTag,
  Warning as PhWarning,
  SpeakerHigh as PhSpeakerHigh,
  SpeakerSlash as PhSpeakerSlash,
  type Icon,
  type IconProps,
} from "@phosphor-icons/react";

function filled(C: Icon) {
  const F = (props: IconProps) => <C weight="fill" {...props} />;
  F.displayName = "FilledIcon";
  return F;
}

export const ArrowRight = filled(PhArrowRight);
export const ArrowLeft = filled(PhArrowLeft);
export const FileText = filled(PhFileText);
export const ShoppingCart = filled(PhShoppingCart);
export const Sparkles = filled(PhSparkle);
export const Grid3x3 = filled(PhSquaresFour);
export const Lock = filled(PhLock);
export const Database = filled(PhDatabase);
export const KeyRound = filled(PhKey);
export const Menu = filled(PhList);
export const X = filled(PhX);
export const Minus = filled(PhMinus);
export const Plus = filled(PhPlus);
export const Trash2 = filled(PhTrash);
export const Truck = filled(PhTruck);
export const ShieldCheck = filled(PhShieldCheck);
export const Package = filled(PhPackage);
export const CheckCircle2 = filled(PhCheckCircle);
export const Loader2 = filled(PhCircleNotch);
export const MapPin = filled(PhMapPin);
export const Phone = filled(PhPhone);
export const Mail = filled(PhEnvelope);
export const MessageCircle = filled(PhWhatsappLogo);
export const ExternalLink = filled(PhArrowSquareOut);
export const Factory = filled(PhFactory);
export const Recycle = filled(PhRecycle);
export const Target = filled(PhTarget);
export const Award = filled(PhMedal);
export const Clock = filled(PhClock);
export const ChevronLeft = filled(PhCaretLeft);
export const ChevronRight = filled(PhCaretRight);
export const Check = filled(PhCheck);
export const PlayCircle = filled(PhPlayCircle);
export const Buildings = filled(PhBuildings);
export const ChevronDown = filled(PhCaretDown);
export const Funnel = filled(PhFunnel);
export const Gear = filled(PhGear);
export const House = filled(PhHouse);
export const SignOut = filled(PhSignOut);
export const Pencil = filled(PhPencilSimple);
export const ImageIcon = filled(PhImage);
export const Star = filled(PhStar);
export const Eye = filled(PhEye);
export const Upload = filled(PhUploadSimple);
export const Tag = filled(PhTag);
export const Warning = filled(PhWarning);
export const SpeakerHigh = filled(PhSpeakerHigh);
export const SpeakerSlash = filled(PhSpeakerSlash);
