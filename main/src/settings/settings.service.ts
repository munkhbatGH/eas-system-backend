import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class SettingsService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}
  
  async getMenuList(user): Promise<any> {
    try {
      if (!user || (user && !user.roleId)) return []
      const menus = await this.connection.collection('setroles').aggregate([
        {$match: { _id: user.roleId, active: true }},
        {$unwind: { path: '$menuList', preserveNullAndEmptyArrays: true}},
        {$lookup: { from: 'setmenus', localField: 'menuList', foreignField: '_id', as: 'menu'}},
        {$unwind: { path: '$menu', preserveNullAndEmptyArrays: true}},
        {$sort: { 'menu.order': 1 }},
        {$project: {
          _id: 1,
          menu: { _id: '$menu._id', parentId: '$menu.parentId', code: '$menu.code', name: '$menu.name', order: '$menu.order', moduleId: '$menu.moduleId', path: '$menu.path', icon: '$menu.icon' },
        }},
      ]).toArray()
      const parentList = menus.filter(a => a.menu && !a.menu.parentId)
      const childrenList = menus.filter(a => a.menu && a.menu.parentId)
      const list: any[] = []
      for (const parent of parentList) {
        const children = childrenList.filter(a => a.menu && a.menu.parentId.toString() === parent.menu._id.toString()).map(a => { return a.menu })
        const item = parent.menu
        item.children = children
        list.push(item)
      }
      return list
    } catch (error) {
      console.log('---Error -> getMenuList---', error);
      throw error
    }
  }
}
