export interface MilitaryDocument {
  DocName: string
  Children: (MilitaryDocument | DocumentWithId)[]
}

export interface DocumentWithId extends Document {
  id: number
}

export interface MilitaryCategory extends Document {
  Children: MilitarySubcategory[]
}

export interface MilitarySubcategory extends Document {
  Children: DocumentWithId[]
}

export interface SpouseCategory extends Document {
  Children: SpouseSubcategory[]
}

export interface SpouseSubcategory extends Document {
  Children: DocumentWithId[]
}

export type RootStructure = [MilitaryCategory, SpouseCategory]
