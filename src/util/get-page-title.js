import defaultSetting from '@/setting'

const title = defaultSetting.title ? defaultSetting.title : 'Back Stage Admin'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle}-${title}`
    }
    return `${title}`
}